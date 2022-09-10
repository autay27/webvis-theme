# webvis-theme

Version 0.1

- Responsive mobile view
- Unlimited amount of images and text per page
- Shortcodes available for prose and chatlogs

---
## Usage notes

### Input script

See the tools folder for a sample file of the kind of script you can write. A Javascript program is included to convert your script into markdown and shortcodes.

### Shortcodes

This theme is designed to be as accessible as possible. Alt text will be automatically generated from the filenames. As such, the speech shortcode has 3 fields:

- Filename
- Alt Text
- Whether the portrait should be displayed on the right

If all fields are omitted, no portrait will be displayed.
If the 3rd field is omitted, the portrait will be displayed on the left by default.
