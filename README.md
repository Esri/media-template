
ArcGIS Configurable Apps will be retired in 2025. The ArcGIS Configurable Apps source code repro is deprecated and will not receive further updates. In addition, this repository will be removed in October 2025, along with the October 2025 ArcGIS Online update.

# Deprecated media-template
Source code for the Media configurable app available in the ArcGIS Online template gallery. 

Media Map is a configurable app template for displaying an interactive map with basic tools and a set of options for limiting map navigation. Designed to fit into small spaces on a web page or as a standalone app.



## Configurable Options

Use Media Map to present content from a map and configure it using the following options:

* Support your map with descriptive text by including an info panel with a title and description, and/or a splash screen to help orient your audience and prime them to receive your message.
* Enable tools on the map including a legend, basemap toggle, overview map, etc.
* Keep your audience focused on what is important by configuring options for map navigation by choosing to include zoom buttons, bookmarks, search, defining min/max zoom levels, or preventing scrolling of the map.
* Use custom CSS to customize the look and feel of the app.

## Use Cases

* Create a simple app to allow users to navigate to predefined locations.
* Optimize your map for consumption on a mobile device by preventing map scrolling.
* Let your user choose between two basemaps to experience different perspectives on your phenomena.
* Sprinkle geography all over the web by adding a spatial component to your web page.
* Create a detailed local map with an overview to provide global context. 


## Requirements 
* Code Editor 
* Node and NPM 
* Experience with TypeScript, HTML and CSS
* Experience with the ArcGIS API for JavaScript 


## Instructions

1. Download and unzip the .zip file or clone the repository.
2. Web-enable the directory.
3. Access the .html page to test. 
4. Install node and npm then run npm install via the command line. 
5. Run npm start to generate js and css files from sass and typescript.
5. Start customizing the app code.

[New to Github? Get started here.](https://github.com/)

## Deploying

1. To deploy this application, download the template from Portal/ArcGIS Online and unzip it.
2. Install npm and run npm install via command line then run npm run build. 
3. Copy the unzipped folder containing the web app template files, such as index.html, to your web server. You can rename the folder to change the URL through which users will access the application. By default the URL to the app will be `http://<Your Web Server>/<app folder name>/dist/index.html`
4. Change the sharing host, found in defaults.js inside the config folder for the application, to the sharing URL for ArcGIS Online or Portal. For ArcGIS Online users, keep the default value of www.arcgis.com or specify the name of your organization.
  - ArcGIS Online Example:  `"sharinghost": location.protocol + "//" + “<your organization name>.maps.arcgis.com`
  - Portal Example where `arcgis` is the name of the Web Adaptor: `"sharinghost": location.protocol + "//" + "webadaptor.domain.com/arcgis"`
5. If you are using Portal or a local install of the ArcGIS API for JavaScript, change all references to the ArcGIS API for JavaScript in index.html to refer to your local copy of the API. Search for the references containing `"//js.arcgis.com/3.13"` and replace this portion of the reference with the url to your local install.
  - For example: `"//webadaptor.domain.com/arcgis/jsapi/jsapi"` where `arcgis` is the name of your Web Adaptor.
6. Copy a map or group ID from Portal/ArcGIS Online and replace the default web map ID in the application’s default.js file. You can now run the application on your web server or customize the application further.

> **Note:** If your application edits features in a feature service, contains secure services or web maps that aren't shared publicly, or generate requests that exceed 200 characters, you may need to set up and use a proxy page. Common situations where you may exceed the URL length are using complex polygons as input to a task or specifying a spatial reference using well-known text (WKT). For details on installing and configuring a proxy page see [Using the proxy](https://developers.arcgis.com/javascript/jshelp/ags_proxy.html). If you do not have an Internet connection, you will need to access and deploy the ArcGIS API for JavaScript documentation from [developers.arcgis.com](https://developers.arcgis.com/).


## Requirements

* Text or HTML editor.
* A little background with JavaScript.
* Experience with the [ArcGIS JavaScript API](http://www.esri.com/) would help.

## Resources

* [Community](https://developers.arcgis.com/en/javascript/jshelp/community.html)
* [ArcGIS for JavaScript API Resource Center](http://help.arcgis.com/en/webapi/javascript/arcgis/index.html)
* [ArcGIS Blog](http://blogs.esri.com/esri/arcgis/)
* [twitter@esri](http://twitter.com/esri)

## Issues

Find a bug or want to request a new feature?  Please let us know by submitting an issue.

## Contributing

Esri welcomes contributions from anyone and everyone. Please see our [guidelines for contributing](https://github.com/esri/contributing).

## Licensing
Copyright 2017 Esri

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

A copy of the license is available in the repository's [license](LICENSE) file.


