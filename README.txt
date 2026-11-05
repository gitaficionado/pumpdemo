PUMP-CS  |  Wisconsin AI + CS Professional Development Week 2027-2028
=====================================================================

FOLDER STRUCTURE
----------------
pump-cs-site/
  index.html                  Home: hero, photo gallery, grade bands, numbers
  history.html                About > The PUMP-CS story
  partners.html               About > Partners
  team.html                   About > Team
  brylow.html                 Dr. Dennis Brylow (linked from Team)
  elementary-school.html      Professional Learning > Elementary School
  middle-school.html          Professional Learning > Middle School
  high-school.html            Professional Learning > High School
  professional-learning.html  Summer PD (overview, benefits, tracks, support, dates)
  research.html               Research (overview, publications, funders)
  contact.html                Contact
  pd-week.html, splash.html   Older pages, not in the menu
  css/styles.css              All styles
  js/main.js                  Menus, mobile drawer, gallery (photo list at the top)
  img/                        Logos, icons, original photos
  img/web/                    Web-sized copies of photos used on the pages
  img/web/thumbs/             Gallery thumbnails
  img/gallery/                Original gallery photos (see README.txt inside)

All links and paths are relative, so the site works in the web root or in any
sub-folder. Keep the sub-folders exactly as they are.


UPLOADING WITH PUTTY TOOLS (Windows)
------------------------------------
PuTTY itself is a terminal. Files are copied with PSCP or PSFTP, which come
with the PuTTY installer (C:\Program Files\PuTTY\). Replace the values in
<angle brackets> with your own.

Option A - PSCP (one command, from Windows Command Prompt, in the folder
that contains pump-cs-site):

  pscp -r pump-cs-site <user>@<server>:<web-folder>/

  This creates <web-folder>/pump-cs-site/ on the server.
  Common web folders: /var/www/html   or   ~/public_html

  With a saved PuTTY session:
  pscp -load "<saved-session>" -r pump-cs-site <saved-session>:<web-folder>/

Option B - PSFTP (interactive):

  psftp <user>@<server>
  psftp> cd <web-folder>
  psftp> lcd <folder that contains pump-cs-site>
  psftp> put -r pump-cs-site
  psftp> quit


AFTER UPLOADING (in a PuTTY terminal session on the server)
------------------------------------------------------------
  cd <web-folder>/pump-cs-site
  find . -type d -exec chmod 755 {} \;
  find . -type f -exec chmod 644 {} \;

Then open https://<your-site>/pump-cs-site/  (rename the folder on the
server to change the address, e.g. mv pump-cs-site pdweek).


UPDATING LATER
--------------
Re-upload only what changed, for example a new photo:

  pscp 01-cs-fundamentals.jpg <user>@<server>:<web-folder>/pump-cs-site/img/gallery/
  pscp brylow.jpg <user>@<server>:<web-folder>/pump-cs-site/img/people/

Remember to chmod 644 any new file.


NOTES
-----
- Static HTML/CSS/JS only: no PHP, database, or build step needed.
- Fonts load from Google Fonts; without internet access the pages fall back
  to system fonts.
