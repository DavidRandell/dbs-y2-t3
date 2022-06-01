## Next Ten Trains
### 01.06.2022

APP: [NEXT TEN TRAINS](https://davidrandell.com/trains/)

David Randell

Student# 10573282

Dublin Business School

CA Submission: B8IT150 Advanced Programming (B8IT150_2122_TME2)

Lecturer: Paul Laird


## Overview

Next Ten Trains is an application that allows the user to select any train station in Ireland. The user can select through a Dropdown filtering system or select the Station by clicking directly on a Google Map which also displays all stations. Once a selection is made, the App will then update the Google Map, centering on the station's location, and display a list of up to 10 Trains arriving/departing from the selected station. The App will also have geolocation capabilities which will help the user to identify the closest station to their present location.

### VISIT THE APP: [NEXT TEN TRAINS](https://davidrandell.com/trains/)

## Goals & Requirements

1. Google Map **displaying** all Stations located in Ireland with stations being **clickable**. The Map will automatically center on any selected station.
2. **Searching** is accomplished through a dropdown **filtering** system to select the type of train (Dart, Mainline etc.) and then Stations on the selected line.
3. Selecting any station will **update** the Map and display a **sorted** list of the next ten trains scheduled to arrive, terminate or depart the selected station.
4. **Geolocation** so the user can identify where they are on the Map and to help find the station nearest their present location.
5. Dropdown information bar which initially will display information about the APP. (See section on future Phases & Enhancements.)
6. **Irish Rail API **will provide the data. The APP will use the data to **search** stations, **sort** train times, **get** station Latitude and Longitude coordinates to **update** the Google Map.
7. PHP proxy to **consume** the API, **validate** the **integrity** of the Data and hand the **response** to the JS to build the Stations and Train Objects and Arrays.

## Specifications and Implementation

The following is a list of Technologies and Services to provide the functionality of Next Ten Trains along with an explanation of how it was leveraged and used.


1. JavaScript & Jquery

    Javascript is the core language handling all the processes and logic of the App. The App leverages the built in jQuery $.ajax Function to perform an asynchronous HTTP (Ajax) request through the PHP proxy to grab the Irish Rail Realtime API data.

2. Knockout JS Framework

    Knockout is a standalone JavaScript implementation of the Model–View–ViewModel pattern with templates. It is a two way binding system which will provide the watching/observing, deleting and updating of the DOM based on user selections and actions.

    1. Watching/Observing - Knockout uses a **data-bind attribute** on HTML elements to create a bridge to the JS & Data.
    2. Deleting/Updating - knockout uses **ko.observable** and **ko.observableArray** **methods** on variables which act as listeners for **state changes** in the DOM (station selections or Google Map clicks) and then acts accordingly by **deleting** and then **updating** the data being provided by JS and the API with its two-way binding system.
3. AJAX & PHP

    The server hosting the Next Ten Trains app is my own shared hosting server. It is a linux/apache server usually used for Wordpress sites. It has limitations such as no CLI and limited Python capabilities. For this reason PHP was used as a proxy to handle the API calls.

4. Irish Rail Realtime API - https://api.irishrail.ie/realtime/

    The App leverages the following 2 API calls in the self.loadStations & self.loadTrainsForStation functions:

1. **Get Station Data by StationCode** - Used to **build** an **Array** of trains due to serve the named station in the next 90 minutes. To build the display of Train data we use Traindate,  Exparrival, Direction, Destination & Expdepart to create a Train **Data Object** needed to populate the **DOM update**. \

2. **Get All Stations by StationType** - **Returns** a list of all stations with StationDesc, StaionCode, StationId, StationLatitude and StationLongitude ordered by Latitude, Longitude **filtered** by StationType - takes a single letter with 4 possible values for the StationType parameter (A for All, M for Mainline, S for suburban and D for DART). This **Array** of Stations is then used to **build** the **Station Object **so the selected station can be populated in the **DOM** and **updated** on Google Maps with StationLatitude and StationLongitude.
5. HTML & CSS

    All front end code; HTML & CSS was written from scratch with the exception of **Eric Meyer’s reset CSS** to reset default browser styles.

6. GIT & GITHUB for version control.

    Repo location: [https://github.com/DavidRandell/dbs-y2-t3](https://github.com/DavidRandell/dbs-y2-t3)

7. Moment.js

    Moment.js is a stand-alone open-source JavaScript framework wrapper for date objects that eliminates native JavaScript date objects, which are cumbersome to use. Moment. js makes dates and time easy to display, format, parse, validate, and manipulate using a clean and concise API.


    In the context of this App it made it much easier to display the Date and times of the trains and to calculate and build up the Realtime departure time.

8. Google Maps API

    I created **map**, **initializeMap** & **createMap** functions along with the **ko.observable **methods to create and populate the **Google Map**.


    I built up a **stationMarkers** Array to hold the station location data (passing in  station.StationLatitude and station.StationLongitude from the Station Object) and along with the **clearMarkers** and **createMarkers** functions to add the Station pin to the Google Map.


    Considering the User Experience, I also included a **supportsGeolocation** function which pins the users location to the Map so they can see the closest station to their location, making their station choice easier.



## Testing Considerations & Expectations

There is no specific Unit Testing present in the Code  as it does not apply in the context of the App build.

There is accommodations in place for a ‘no response’ from the API \


**User Journey Testing Expectations**


* On page load the user should see:
    * A Random background image displayed on the Body tag.
    * All Stations listed by default and the default selected station being Dublin: Pearse.
    * Update the Arrivals To: heading with the default station name: Dublin: Pearse.
    * A table of the next Trains for Dublin: Pearse.
    * Map should be created showing pins for all stations in Oreland and centering on Dublin: Pearse. \

* Selecting the Station Type dropdown should:
    * Update the Station dropdown with only stations that apply to that Type of Station.
    * Update the Arrivals To: heading with the default station name: Dublin: Pearse.
    * Update the Train table and Map with the Default Station: Dublin:Pearse. \

* Selecting a specific station in the Station dropdown will:
    * Clear the Train table
    * Update the Arrivals To: heading with the Selected station name.
    * Update the Train table with the next trains scheduled to arrive.
    * PanTo the selected Station centering it on the Google Map.  \

* Clicking on Go To my Location button will:
    * (Browser) Prompt the user to allow location data for the website.
    * Update the Google Map with their actual location adding a Blue pin and centering on their location.


## Reflections and Future Phases

I have worked for several years as a Front End Developer which I migrated to from a visual design background. My motivation for taking the course was to build more programming skills, specifically JavaScript which is a requirement for my current role as a Web Developer. This role does not technically require Python experience so I decided this project should be focused on the technologies I need to be stronger for my Web Developer role.

I found the App to be a great challenge in incorporating various technologies. If I were building again I would probably focus on more modern frameworks such as React or Vue, but I have used Knockout in previous roles so that understanding allowed me to focus on WHAT the app would do and to better understand working with data from an API and integrate more CRUD programmatic functionality into the App.


### Future Phases and Improvements

One of the additions I wanted to add to the App was Flask Login and Flask Admin elements. There were as follows;



1. In the slide down area at the top of the App there would be a Login area where the user could register, allowing them to sign in with their Name and select their Favorite (default) station.
2. Their details would be saved to a DB or long term session storage so that upon returning to the App it would always default to their Favorite station.

Unfortunately, I ran into a technology limitation which forced me to have to leave these enhancements and functionality to a future phase of the App. I have provided a **Video explanation** with the project submission. The limitations were as follows;



1. My shared hosting server would not allow CLI access nor would it run the Flask Python library. So I couldn’t add the Flask functionality.
2. When I deployed the APP to the DBS Azure server the PHP Proxy/API call stopped working, effectively rendering the App dead. I wasn’t able to solve the issue so I could not build any Flask functionality into the App.


## Bibliography of Technologies and Websites



1. _Knockout : Home. [https://knockoutjs.com/](https://knockoutjs.com/)_
2. _Moment.Js | Home. [https://momentjs.com/](https://momentjs.com/)_
3. ‘Google Maps Platform’. Google Developers, [https://developers.google.com/maps](https://developers.google.com/maps).
4. ‘Irish Rail Realtime API’. Irish Rail Realtime API, [https://api.irishrail.ie/realtime/](https://api.irishrail.ie/realtime/).
5. JQuery. https://jquery.com/.  JS Foundation
6. JQuery.Ajax() | JQuery API Documentation. [https://api.jquery.com/jquery.ajax/](https://api.jquery.com/jquery.ajax/).
7. ‘Stack Overflow - Where Developers Learn, Share, & Build Careers’. Stack Overflow, [https://stackoverflow.com/](https://stackoverflow.com/). - General questions and coding help.
8. ‘Web Hosting’. Blacknight Solutions, [https://www.blacknight.com/web-hosting/](https://www.blacknight.com/web-hosting/).
9. Unsplash. Beautiful Free Images & Pictures | Unsplash. [https://unsplash.com/](https://unsplash.com/). - Random Background Images
