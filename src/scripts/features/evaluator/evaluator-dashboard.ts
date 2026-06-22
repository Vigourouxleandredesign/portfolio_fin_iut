/**
 * @file Evaluator dashboard — private assets with signed URLs
 * @module features/evaluator
 * @description Lists project_assets and resolves signed Storage URLs after auth.
 * @see {@link ../../../../docs/SUPABASE.md}
 * @see {@link https://supabase.com/docs/reference/javascript/storage-from-createsignedurl}
 */

import { getSupabaseClient } from '../../modules/supabase-client';
import {
  EVALUATOR_STORAGE_BUCKET,
  SIGNED_URL_TTL_SECONDS,
  type AssetType,
  type ProjectAsset,
} from '../../modules/supabase-client.types';

/**
 * Asset with a time-limited signed URL for private Storage objects.
 */
export type ProjectAssetWithUrl = ProjectAsset & {
  signedUrl: string | null;
};

const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  image: 'Image',
  video: 'Vidéo',
  model3d: 'Modèle 3D',
  document: 'Document',
};

/**
 * Fetches all project assets visible to the current user (RLS filters rows).
 */
export async function fetchProjectAssets(): Promise<ProjectAsset[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('project_assets')
    .select(
      'id, owner_id, title, description, asset_type, storage_path, is_public, created_at',
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProjectAsset[];
}

/**
 * Creates a signed URL for a storage path in the evaluator bucket.
 * @param storagePath - Path inside evaluator-assets bucket
 */
export async function createSignedAssetUrl(
  storagePath: string,
): Promise<string | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.storage
    .from(EVALUATOR_STORAGE_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error('[evaluator] signed URL', error.message);
    return null;
  }

  return data.signedUrl;
}

/**
 * Loads assets and attaches signed URLs where applicable.
 */
export async function loadAssetsWithSignedUrls(): Promise<ProjectAssetWithUrl[]> {
  const assets = await fetchProjectAssets();

  const withUrls = await Promise.all(
    assets.map(async (asset) => ({
      ...asset,
      signedUrl: await createSignedAssetUrl(asset.storage_path),
    })),
  );

  return withUrls;
}

/**
 * Renders the asset list into the dashboard container using safe DOM APIs.
 * @param listRoot - Element with `[data-evaluator-asset-list]`
 * @param assets - Assets with signed URLs
 */
export function renderAssetList(
  listRoot: HTMLElement,
  assets: ProjectAssetWithUrl[],
): void {
  listRoot.replaceChildren();

  if (assets.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'evaluator-dashboard__empty';
    empty.textContent = 'Aucun média privé pour le moment.';
    listRoot.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'evaluator-dashboard__list';

  for (const asset of assets) {
    list.appendChild(createAssetListItem(asset));
  }

  listRoot.appendChild(list);
}

function createAssetListItem(asset: ProjectAssetWithUrl): HTMLLIElement {
  const item = document.createElement('li');
  item.className = 'evaluator-dashboard__item';

  const title = document.createElement('h2');
  title.className = 'evaluator-dashboard__item-title';
  title.textContent = asset.title;

  const meta = document.createElement('p');
  meta.className = 'evaluator-dashboard__item-meta';
  meta.textContent = `${ASSET_TYPE_LABELS[asset.asset_type]} · ${formatDate(asset.created_at)}`;

  item.appendChild(title);
  item.appendChild(meta);

  if (asset.description) {
    const desc = document.createElement('p');
    desc.className = 'evaluator-dashboard__item-desc';
    desc.textContent = asset.description;
    item.appendChild(desc);
  }

  if (asset.signedUrl) {
    item.appendChild(createAssetPreview(asset));
  } else {
    const unavailable = document.createElement('p');
    unavailable.className = 'evaluator-dashboard__item-error';
    unavailable.textContent = 'Fichier inaccessible (Storage ou permissions).';
    item.appendChild(unavailable);
  }

  return item;
}

function createAssetPreview(asset: ProjectAssetWithUrl): HTMLElement {
  const url = asset.signedUrl;
  if (!url) {
    const fallback = document.createElement('p');
    fallback.textContent = 'URL indisponible.';
    return fallback;
  }

  if (asset.asset_type === 'image') {
    const img = document.createElement('img');
    img.className = 'evaluator-dashboard__preview evaluator-dashboard__preview--image';
    img.src = url;
    img.alt = asset.title;
    img.loading = 'lazy';
    img.decoding = 'async';
    return img;
  }

  if (asset.asset_type === 'video') {
    const video = document.createElement('video');
    video.className = 'evaluator-dashboard__preview evaluator-dashboard__preview--video';
    video.src = url;
    video.controls = true;
    video.preload = 'metadata';
    return video;
  }

  const link = document.createElement('a');
  link.className = 'evaluator-dashboard__link';
  link.href = url;
  link.textContent =
    asset.asset_type === 'model3d' ? 'Télécharger le modèle 3D' : 'Ouvrir le fichier';
  link.rel = 'noopener noreferrer';
  link.target = '_blank';
  return link;
}

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

/**
 * Mounts the evaluator dashboard on `[data-evaluator-dashboard]`.
 * @param root - Dashboard container
 * @returns Teardown function
 */
export function initEvaluatorDashboard(root: HTMLElement): () => void {
  const listRoot = root.querySelector<HTMLElement>('[data-evaluator-asset-list]');
  const statusEl = root.querySelector<HTMLElement>('[data-evaluator-status]');
  const logoutBtn = root.querySelector<HTMLButtonElement>('[data-auth-logout]');

  if (!listRoot || !statusEl || !logoutBtn) {
    console.warn('[evaluator] Missing dashboard elements');
    return () => undefined;
  }

  let cancelled = false;

  const setStatus = (message: string): void => {
    statusEl.textContent = message;
    statusEl.hidden = message.length === 0;
  };

  const load = async (): Promise<void> => {
    setStatus('Chargement des médias…');
    listRoot.replaceChildren();

    try {
      const assets = await loadAssetsWithSignedUrls();
      if (cancelled) return;
      renderAssetList(listRoot, assets);
      setStatus('');
    } catch (err) {
      if (cancelled) return;
      setStatus('Impossible de charger les médias.');
      console.error('[evaluator] load', err);
    }
  };

  void load();

  return () => {
    cancelled = true;
  };
}
