/* Plain HTML Clerk bridge. Set this to the Clerk publishable key from your dashboard. */
const CLERK_PUBLISHABLE_KEY = window.CLERK_PUBLISHABLE_KEY || 'pk_test_Y2hhcm1pbmcta2FuZ2Fyb28tMjE3OS5jbGVyay5hY2NvdW50cy5kZXYk';
const authLanding = location.pathname.endsWith('landing.html');
const clerkDomain = atob(CLERK_PUBLISHABLE_KEY.split('_')[2]).slice(0, -1);
const initializeClerk = async () => {
 try {
  const { Clerk } = await import('https://esm.sh/@clerk/clerk-js@6?bundle');
  await new Promise((resolve, reject) => {
    const uiScript = document.createElement('script');
    uiScript.src = `https://${clerkDomain}/npm/@clerk/ui@1/dist/ui.browser.js`;
    uiScript.async = true;
    uiScript.crossOrigin = 'anonymous';
    uiScript.onload = resolve;
    uiScript.onerror = () => reject(new Error('Failed to load Clerk UI bundle'));
    document.head.append(uiScript);
  });
  const clerk = new Clerk(CLERK_PUBLISHABLE_KEY);
  if (window.__internal_ClerkUICtor) await clerk.load({ ui: { ClerkUI: window.__internal_ClerkUICtor } });
  else await clerk.load();
  window.CommunityAuth = clerk;
  if (authLanding) {
    document.querySelector('[data-auth-loading]')?.remove();
    if (clerk.user) document.querySelector('[data-auth-user]')?.replaceChildren(clerk.user.firstName || clerk.user.username || 'Account');
    clerk.mountSignIn(document.querySelector('#clerk-sign-in'));
    return;
  }
  const signedOut = !clerk.user;
  if (signedOut) { document.body.classList.add('signed-out'); location.replace('landing.html'); return; }
  if (location.pathname.endsWith('settings.html')) { document.querySelector('[data-auth-loading]')?.remove(); clerk.mountUserProfile(document.querySelector('#clerk-settings')); document.querySelector('[data-settings-signout]')?.addEventListener('click', async () => { await clerk.signOut(); location.href = 'landing.html'; }); return; }
 } catch (error) {
   console.error(error);
   const loading = document.querySelector('[data-auth-loading]');
   if (loading) loading.textContent = `Unable to load account access: ${error?.message || 'unknown error'}`;
 }
};
initializeClerk();
