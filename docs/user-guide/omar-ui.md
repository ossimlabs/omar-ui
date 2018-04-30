# OMAR-UI

## Home Navigation Bar

### About
- **Release** current O2 release name
- **Release Number** current O2 release number
- **UI Build Version** omar-ui build version number

### Metrics
- **Service Health & Status** Displays a Spring Cloud Eureka page with information on the system status, uptime, and individual service statuses for the O2 deployment

## Image Space

### Download
Download a raw image file. _Note: This will package the raw, overview and histogram files into a zip folder._

### Geo-Jump
There is an input box located above the map all the way to the right. The box is meant to take in various kinds of input and will automatically determine if a BE, coordinate or placename is entered. In all cases, if a match is found, the map will center to the appropriate area.

### Image Properties
#### Bands
For multi-banded imagery, the red, green and blue "color guns" can be routed to any band within the image. Please aim responsibly.
#### Brightness
Uniformly adjust the brightness value of each pixel.
#### Contrast
Uniformly adjust the contrast value of each pixel, making the light pixels lighter and the dark pixels darker.
#### Dynamic Range Adjustmet
Adjust the ratio of the brightest to darkest pixel. Have you had your coffee yet, because this is about to get statistical. If you take the brightness value of each pixel and make a histogram (that bell-curve thing from school that you always seemed to be on the wrong side of) you'll end up with some kind of overall shape. The DRA setting literally "stretches" or "squishes" that shape. Then all those brighrness values are redistributed which can greatly enhance the overall image.
#### Interpolation
Select the method by which unknown pixels are determined from known pixels. Things get complicated during image processing, for example, when enlarging an image. If you end up with more pixels than you started, how do you determine what those new pixels look like? Do you poll the audience, phone a friend or maybe just look at the neighboring pixels?
#### Sharpen Mode
Select the kernel size used for sharpening. You can also try squinting really hard to bring things into focus.

### Map
* **Rotation:**
You can rotate the map by holding Shift + Alt while clicking and dragging.

### Measure
* Measurements
* * **Path:**
Single-click to start measuring. Double-click to end.
* * **Area:**
Single-click to start measuring. Double-click to end.
* * **Clear:**
Disables the measurement map interaction.
* Position Quality Evaluator
PQE attempts to map a pixel with a geographic coordinate (i.e. lat/lon) by conducting a ray-trace intersection through the surface of the Earth using the image's sensor model (when available).
* * **Enable:**
Just click anywhere.
* * **Clear:**
Disable to PQE map interaction.

### Screenshot
This will pretty much make the map take a selfie and then your browser will download the result.

### Share
Get a sharable link of the image.

### Zoom
* **Full Resolution:**
Zooms the map to full resolution.
* **Maximum Extent:**
Zooms the map out until the entire image can fit in the viewport.

## Search

### Filters
#### Keyword
* **BE:**
Basic Encyclopedia Number - An alphanumeric sequence representing a particular target.
* **CC:**
Country Code - Two letters representing a particular country.
* **File:**
Filename - The filename of an image.
* **Image:**
Image ID - The Image ID found in the metadata.
* **Mission:**
Mission ID - The image's mission ID.
* **Sensor:**
Sensor ID - The image's sensor ID.
* **Target:**
Target ID - The image's target ID.
* **WAC:**
World Area Code - A numeric sequence representing a particular are on the globe.

#### Ranges
* **Cloud Cover:**
A number between 0 and 100.
* **NIIRS:**
A number between 0 and 9.
* **Azimuth:**
A number between 0 and 360.
* **Graze/Elev:**
A number between 0 and 90.
* **Sun Azimuth:**
A number between 0 and 360.
* **Sun Elevation:**
A number between -90 and 90.

#### Spatial
* **Map Viewport:**
This filter is on by default. It constrains the query to the boundaries of the current map extent.
* **Point:**
Single clicking on the map will return a potential list of images at that location.
* **Polygon:**
Left-click and hold with the ALT key to create a box that will return a potential list of images.

#### Temporal
* **Date Type:**
Specify which metadata field is to be compared, acquisition date or ingest date.
* **Duration:**
Specify the start and stop dates.

### Map
The map will show footprints for all the imagery in the database according to whatever filters are enabled. Every time the map is moved, a new query is issued and the footprints as well as search results are updated.

TIP: You can right-click the map to get that point's coordinate. Also, the mouse-coordinate format found at the bottom-right of the map can be changed simply by clicking on it.

* **Mouse Coordinates:**
The current coordinate of the mouse is displayed in the lower-right corner of the map. You can click the box to cycle through DD, DMS and MGRS formats. Right-click anywhere on the map to get a dialog box of that coordinate in all three formats.

* **Rotation:**
You can rotate the map by holding Shift + Alt while clicking and dragging.

### Results
Search results are displayed in a box to the right of the map with the total number of results shown in the top-right corner. Each image will have the corresponding links associated with it.

* **<span class="fa fa-arrows"></span>&nbsp;:**
Zoom to an image extent.
* **<span class="fa fa-desktop"></span>&nbsp;:**
View an image in image/raw space.
* **<span class="fa fa-history"></span>&nbsp;:**
View an orthorectified version of an image in TLV.
* **<span class="fa fa-map"></span>&nbsp;:**
Download a superover KML for an image.
* **<span class="fa fa-share-alt"></span>&nbsp;:**
Get a sharable link of an image.
* **<span class="fa fa-download"></span>&nbsp;:**
Download a raw image file.
* **<span class="fa fa-file-image-o"></span>&nbsp;:**
Get a JPIP stream URL.
* **<span class="fa fa-image"></span>&nbsp;:**
Get a JPIP stream URL that has been orthorectified.

#### Export
* **CSV:**
Comma Separated Values - Produces a listing of the images and metadata in CSV format.
* **GeoRSS:**
Geography Rich Site Summary - Produces an RSS feed for the currently selected search filters.
* **GML2:**
Geography Markup Language - Produces a listing of the images and metadata in GML2 format.
* **GML3:**
Geography Markup Language - Produces a listing of the images and metadata in GML3 format.
* **GML32:**
Geography Markup Language - Produces a listing of the images and metadata in GML32 format.
* **JSON:**
Javascript Object Notation - Produces a listing of the images and metadata in JSON format.
* **KML:**
Keyhole Markup Language - Produces a listing of the images and metadata in KML format.
* **TLV:**
Time Lapse Viewer - Opens a new window to view

#### Sort
* **Acquired (Newest):**
Sorts the list such that the image with the most recent acquisition date is first.
* **Acquired (Oldest):**
Sorts the list such that the image with the most recent acquisition date is last.
* **Ingested (Newest):**
Sorts the list such that the image with the most recent ingest date is last.
* **Ingested (Oldest):**
Sorts the list such that the image with the most recent acquisition date is last.
* **Image ID (Asc):**
Sorts the list in alphabetical order according to image ID.
* **Image ID (Desc):**
Sorts the list in reverse alphabetical order according to image ID.
* **Mission (Asc):**
Sorts the list in alphabetical order according to mission ID.
* **Mission (Desc):**
Sorts the list in reverse alphabetical order according to mission ID.
* **Sensor (Asc):**
Sorts the list in alphabetical order according to sensor ID.
* **Sensor (Desc):**
Sorts the list in reverse alphabetical order sensor to image ID.

### Search Box
There is an input box located above the map all the way to the right. The box is meant to take in various kinds of input and will automatically determine if a BE, coordinate, image ID or placename is entered. In all cases, if a match is found, the map will zoom to the appropriate area.
