// Overall viewmodel for this screen, along with initial state
class AppViewModel {
    constructor() {
        var self = this;

        // Load Stations & listen for change
        self.stations = ko.observableArray([]);

        self.selectedStation = ko.observable();

        // Load Station Types & listen for change
        self.stationTypes = ko.observableArray([{ code: 'A', name: "All" }, { code: 'D', name: "Dart" }, { code: 'M', name: "Main Line" }, { code: 'S', name: "Suburban Dublin" }]);
        self.selectedStationType = ko.observable();

        // Convert Departure time to minutes countdown
        self.getTimespan = function (date, time) {
            return new moment(date + " " + time).fromNow();
        };

        // Shorten Limerick Junction
        self.cleanStationName = function (stationName) {
            stationName = stationName.replace("Junction", "Junc.");
            return stationName;
        };

        // Clearing & Setting Station Markers on Google Map
        self.stationMarkers = [];

        self.clearMarkers = function () {
            for (var i = 0; i < self.stationMarkers.length; i++) {
                self.stationMarkers[i].setMap(null);
            }
            self.stationMarkers = [];
        };

        self.createMarkers = function () {
            var s = self.stations();
            for (var i = 0; i < s.length; i++) {
                var station = s[i];
                var location = new google.maps.LatLng(station.StationLatitude, station.StationLongitude);
                var marker = new google.maps.Marker({
                    position: location,
                    map: self.map(),
                    title: station.StationDesc,
                    station: station
                });

                // Change Selected Station onClick
                google.maps.event.addListener(marker, 'click', function () {
                    self.selectedStation(this.station);
                });

                self.stationMarkers.push(marker);
            };
        };


        self.refreshTrains = function () {
            self.loadTrainsForStation(self.selectedStation().StationCode);
        };

        self.displayLoader = ko.observable(false);

        // Load Station list from the API based on Type
        self.loadStations = function (selectedStationType) {

            $.ajax({
                url: "https://david.dbsprojects.ie/apiproxy.php",
                data: { url: 'https://api.irishrail.ie/realtime/realtime.asmx/getAllStationsXML_WithStationType?StationType=' + selectedStationType },
                dataType: 'text',
                success: function (resp) {
                    console.log("Hello World 0");
                    let parser = new DOMParser(); 
                    let tree = parser.parseFromString(resp,'text/xml');

                    let objStation = [];

                    let nodeStation = tree.getElementsByTagName("objStation");   

                    Array.from(nodeStation).forEach(x => {
                        let station = {};
                        station["StationDesc"] = x.getElementsByTagName("StationDesc")[0].textContent;
                        station["StationLatitude"] = x.getElementsByTagName("StationLatitude")[0].textContent;
                        station["StationLongitude"] = x.getElementsByTagName("StationLongitude")[0].textContent;
                        station["StationCode"] = x.getElementsByTagName("StationCode")[0].textContent;
                        station["StationId"] = x.getElementsByTagName("StationId")[0].textContent;
                        console.log(station);
                        objStation.push(station);
                    });

                    self.clearMarkers();
                    self.stations(objStation);
                    self.createMarkers();
                    self.stations.sort(function (left, right) {
                        return left.StationDesc == right.StationDesc ? 0 : (left.StationDesc < right.StationDesc ? -1 : 1);
                    });

                    self.selectedStation(self.findStationByCode("CNLLY"));
                },
                error: function (a, b, c) {
                    console.log(' Load Stations Error');s
                }

            });
        };

        self.findStationByCode = function (stationCode) {
            var stations = self.stations();
            for (var i = 0; i < stations.length; i++) {
                if (stations[i].StationCode == stationCode) {
                    return stations[i];
                }
            }

            return null;
        };


        self.selectedStationType.subscribe(function (newStationTypes) {
            self.loadStations(newStationTypes.code);
        });

        self.selectedStation.subscribe(function (newSelectedStation) {
            if (newSelectedStation) {
                self.loadTrainsForStation(newSelectedStation.StationCode);
                var center = new google.maps.LatLng(newSelectedStation.StationLatitude, newSelectedStation.StationLongitude);
                self.map().panTo(center);
            }
        });

        // Detect GeoLocation support
        self.supportsGeolocation = ko.computed(function () { return navigator.geolocation ? true : false; }, this);

        self.locationMarker = null;

        self.goToLocation = function () {

            if (self.locationMarker) {
                self.locationMarker.setMap(null);
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = new google.maps.LatLng(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    self.map().panTo(pos);
                    // Add Marker
                    self.locationMarker = new google.maps.Marker({
                        position: pos,
                        icon: '../images/yourLocation.png',
                        map: self.map()
                    });
                });
            }
        };
        // Load Train Data based on Station selected
        self.trainData = ko.observableArray([]);
        self.loadTrainsForStation = function (stationCode) {
            self.displayLoader(true);
            self.trainData([]);
            $.ajax({
                url: "https://david.dbsprojects.ie/apiproxy.php",
                data: { url: 'https://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML?StationCode=' + stationCode },
                dataType: 'text',
                success: function (resp) {
                    let parser = new DOMParser(); 
                    let tree = parser.parseFromString(resp,'text/xml');



                    let objStationData = [];

                    let nodeStationData = tree.getElementsByTagName("objStationData");   

                    Array.from(nodeStationData).forEach(x => {
                        let trainData = {};
                        trainData["Traindate"] = x.getElementsByTagName("Traindate")[0].textContent;
                        trainData["Exparrival"] = x.getElementsByTagName("Exparrival")[0].textContent;
                        trainData["Direction"] = x.getElementsByTagName("Direction")[0].textContent;
                        trainData["Destination"] = x.getElementsByTagName("Destination")[0].textContent;
                        trainData["Expdepart"] = x.getElementsByTagName("Expdepart")[0].textContent;
                        console.log(trainData);
                        objStationData.push(trainData);
                    });




                    // Return up to ten results
                    //var trains = resp.objStationData;
                    // Start of new code
                    self.trainData(objStationData);
                    self.trainData.sort(function (left, right) { return left.Expdepart == right.Expdepart ? 0 : (left.Expdepart < right.Expdepart ? -1 : 1); });
                    console.log(self.trainData());
                    // End of New Code
                    if (self.trainData() && self.trainData().length > 10) {
                        console.log('true');
                        self.trainData(self.trainData().slice(0, 9));
                    }
                    self.displayLoader(false);

                },
                error: function (_a, _b, _c) {
                    console.log('Load Trains for Station Error');
                    self.displayLoader(false);
                }
            });
        };
        // Google Map
        self.map = ko.observable(null);

        self.map.subscribe(function (_newMap) {
            self.loadStations('A');
        });

        self.initialize = function () {
            self.initializeMap();
        };

        self.initializeMap = function () {
            var centerLoc = new google.maps.LatLng(53.3531, -6.24591);
            self.createMap(centerLoc);
        };

        self.createMap = function (location) {
            var mapOptions = {
                zoom: 12,
                center: location,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            self.map(new google.maps.Map(document.getElementById('map-canvas'),
                mapOptions));
        };
    }
}