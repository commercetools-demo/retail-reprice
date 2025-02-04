import React, { useMemo } from 'react';
import { Map as GoogleMap } from '@vis.gl/react-google-maps';
import { MarkerWithInfowindow } from './marker-with-infowindow';
import { TStore } from '../../types/generated/ctp';

interface Props {
  stores?: TStore[];
}

export interface Marker {
  id: string;
  lat: number;
  lng: number;
  storeName: string[];
  channelName: string;
  type: string;
}

const Map: React.FC<Props> = ({ stores }) => {
  const marks: Marker[] | undefined = useMemo(() => {
    return stores
      ?.map((store) => {
        return store.distributionChannels
          ?.map((channel) => {
            return {
              id: channel.id,
              lat: channel.geoLocation?.coordinates?.[1],
              lng: channel.geoLocation?.coordinates?.[0],
              storeName: [store.name],
              channelName: channel.name,
              type: 'distribution channel',
            } as Marker;
          })
          .concat(
            store.supplyChannels?.map((channel) => {
              return {
                id: channel.id,
                lat: channel.geoLocation?.coordinates?.[1],
                lng: channel.geoLocation?.coordinates?.[0],
                storeName: [store.name],
                channelName: channel.name,
                type: 'supply channel',
              } as Marker;
            })
          );
      })
      .reduce((prev: Marker[], curr) => prev.concat(curr), [])
      .filter((channel) => channel.lat && channel.lng)
      .filter(
        (channel, index, self) =>
          self.findIndex((t) => t.id === channel.id) === index
      );
  }, [stores]);
  console.log(marks);

  return (
    <GoogleMap
      defaultZoom={5}
      defaultCenter={{ lat: 25.631662, lng: -103.564185 }}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      mapId={'mapbox.light-5'}
    >
      {marks?.map((mark) => (
        <MarkerWithInfowindow key={mark.id} mark={mark} />
      ))}
    </GoogleMap>
  );
};

export default Map;
