import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import SubscribeForm from './SubscribeForm'; // Import SubscribeForm
import { sendNotificationToLotSubscribers } from './MessagingService'; // Import MessagingService
import Popup from './PopupComponent'; // Adjust the path as necessary based on your file structure


// Define the Poi type
type Poi = {
  key: string;
  location: {
    lat: number;
    lng: number;
  };
  name?: string; // Add this to store parking lot names
};

// ParkingLots component that fetches nearby parking lots
const ParkingLots = ({ userLocation }) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [parkingLots, setParkingLots] = useState<Poi[]>([]);

  useEffect(() => {
    if (!placesLib || !map) return;

    const svc = new placesLib.PlacesService(map);

    const location = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);
    const request = {
      location,
      radius: 3000,
      type: 'parking',
    };

    svc.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const locations: Poi[] = results.map((lot) => ({
          key: lot.place_id,
          location: {
            lat: lot.geometry.location.lat(),
            lng: lot.geometry.location.lng(),
          },
          name: lot.name, // Store the parking lot name
        }));
        setParkingLots(locations);
      } else {
        console.error('Nearby search failed:', status);
      }
    });
  }, [placesLib, map]);

  return <PoiMarkers pois={parkingLots} />;
};

