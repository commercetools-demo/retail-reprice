import React, { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { Marker } from '.';

export const MarkerWithInfowindow = ({
  mark,
  onClick,
}: {
  onClick?: () => void;
  mark: Marker;
}) => {
  const [infowindowOpen, setInfowindowOpen] = useState(true);
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => {
          setInfowindowOpen(true);
          onClick?.();
        }}
        position={{ lat: mark.lat, lng: mark.lng }}
        title={mark.storeName?.[0] || mark.channelName}
      />
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}
        >
          <span>{`Store: ${mark.storeName?.[0] || mark.channelName}`}</span>
          <span>{`Type: ${mark.type}`}</span>
        </InfoWindow>
      )}
    </>
  );
};
