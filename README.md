# AI Stat Lab — GitHub Pages release

Official website draft for the Artificial Intelligence & Statistics Lab at Chung-Ang University.

## Quick deployment (GitHub Pages)

1. Sign in to GitHub as `aistatlab`.
2. Create a **Public** repository named `aistatlab-website` at https://github.com/new . Initialize it with a README if asked.
3. Select **Add file → Upload files** and upload the contents of this folder, preserving `assets/` and `data/` subdirectories. A local Git client is more reliable for uploading the full folder structure; an alternative is to upload `index.html` and the two directories using the browser folder drag-and-drop function. Commit directly to `main`.
4. Open **Settings → Pages**, select **Deploy from a branch**, `main`, and `/ (root)`, then Save.
5. When publishing finishes, open https://aistatlab.github.io/aistatlab-website/ . The domain and path only work if the repository was created with the proposed account and name.

## Update

- Publication, project and member data: `data/content.js`.
- HTML / layout: `index.html`, `assets/style.css`.
- Interaction / search / language switching: `assets/app.js`.
- Brand marks and site artwork: `assets/img/`.

## Public launch checklist

- Confirm research members and paper acceptance/submission statuses before declaring the site an official source. The previous site data may be stale; for instance, at least one manuscript publication status requires review.
- Obtain permission for any student photos before uploading. Until then the site uses initials, not invented images.
- The campus-themed hero illustration is a conceptual graphic, **not a real campus photograph**.
- Keep the original Google Sites website until the public site is reviewed.
- This release is static and does not require server-side code or secret credentials.

## Branding

Only the user's supplied `AI Stat Lab` and `Artificial Intelligence & Statistics Lab` logos are packaged. The old wordmark is excluded.
