GALLERY PHOTOS (home page carousel)
===================================
The carousel list lives at the top of js/main.js (the SLIDES list).
Each entry names the photo, a thumbnail, alt text, and a caption.

Web-sized copies of the gallery photos are in img/web/ (thumbnails in
img/web/thumbs/). The originals in img/ and img/gallery/ were not changed.

To add a photo:
  1. Put the photo in this folder (img/gallery/). Aim for about 1600 px wide
     and under 400 KB.
  2. Add a line to SLIDES in js/main.js, for example:
       { src: "img/gallery/my-photo.jpg", alt: "What is happening in the photo",
         title: "Short caption title", text: "One-sentence caption." },
     (thumb is optional; without it the photo itself is used.)
  3. Upload the photo and js/main.js.

File names are case-sensitive on Linux servers.
