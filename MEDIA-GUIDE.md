# Where to put your photos and videos

Drop files into these folders, push to GitHub, done. The site finds them by name.
Any common extension works (.mp4 .MP4 .mov .MOV .m4v .webm / .jpg .jpeg .png .webp).
Missing files are simply skipped: an empty folder means that section does not show.
Numbers can have gaps (reel-01, reel-02, reel-05 is fine).

## Videos
| What                        | Where and name                                         | Slots |
|-----------------------------|--------------------------------------------------------|-------|
| Instagram reels (vertical)  | videos/reels/reel-01 ... reel-12                       | 12    |
| Cinematic videos            | videos/cinematic/cinematic-01 ... cinematic-12         | 12    |
| Motion graphics, big top one| videos/motion-graphics                                 | 1     |
| Motion graphics, more       | videos/motion-graphics-2 ... motion-graphics-6         | 5     |
| About page intro video      | videos/adlobby-introduction                            | 1     |
| Home hero background video  | videos/hero  (optional, replaces the hero image)       | 1     |

## Images
| What                              | Where and name                                           | Slots |
|-----------------------------------|----------------------------------------------------------|-------|
| Posters                           | images/posters/poster-01 ... poster-12                   | 12    |
| Branding case study (one folder per brand) | images/branding/brand-01/cover and page-01 ... page-12 ; next brand in brand-02 ... brand-06 | 6 brands |
| Thumbnail for any video (optional)| images/thumbs/<video name>  e.g. images/thumbs/reel-03   |       |
| Home hero image                   | images/hero                                              | 1     |
| Bottom call-to-action background  | images/cta                                               | 1     |
| About page photo                  | images/about-studio                                      | 1     |
| About intro video cover (optional)| images/adlobby-introduction-poster                       | 1     |
| Services: cinematic picture       | images/services-cinematic                                | 1     |
| Services: cover for big motion video | images/services-reels                                 | 1     |
| Home service previews (optional)  | images/service-video, images/service-reels, images/service-design | (uses your first video/poster if missing) |

## Names and descriptions (optional)
Items get automatic names ("Reel 03", "Poster 05"). To give one a real name, edit META in data.js
(key = file name without extension, e.g. "poster-05"). To allow more than 12 files in a folder, raise the number in SLOTS in data.js.

## Video tips
- Vertical reels: 1080 x 1920, MP4, H.264 video + AAC audio, ideally under 15 MB each.
- Export with "Web optimized / fast start" so they start quickly.
- iPhone .MOV files are often HEVC and do not play in many browsers. If a video has the right name but does not show, convert it to H.264 MP4.
  ffmpeg -i in.mov -c:v libx264 -crf 26 -preset slow -vf "scale=1080:-2" -c:a aac -b:a 128k -movflags +faststart reel-02.mp4
