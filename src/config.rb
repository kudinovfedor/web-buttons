require 'compass/import-once/activate'
# Require any additional compass plugins here.

# The environment mode. Defaults to :development, can also be :production
# Change this to :production when ready to deploy the CSS to the live server.
environment = :development

# Set this to the root of your project when deployed:
# The path to the project when running within the web server.
http_path = "/"
# The directory where the css stylesheets are kept.
css_dir = "css"
# The directory where the font files are kept.
fonts_dir = "fonts"
#The directory where the images are kept.
images_dir = "img"
# The directory where the javascripts are kept.
javascripts_dir = "js"
# The directory where the sass stylesheets are kept.
sass_dir = "sass"
# The directory where generated images are kept. It is relative to the project_path.
# Defaults to the value of images_dir.
generated_images_dir = images_dir + "/sprite"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :development) ? :expanded : :compressed

# Indicates whether the compass helper functions should generate relative urls from the generated css to assets,
# or absolute urls using the http path for that asset type.
# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = (environment == :development) ? true : false

# Set this to true to enable sourcemap output.
sourcemap = (environment == :development) ? true : false

# Can be :scss or :sass. Defaults to :scss.
preferred_syntax = :scss

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
