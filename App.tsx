import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Button,
  Platform,
  TouchableHighlight,
} from 'react-native';

import {MAP_API_KEY} from '@env';
import {useCallback, useState, useEffect, useRef} from 'react';
import MapView, {Circle, LatLng, Marker, Point} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const useStyle = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
});

type Location = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const App = () => {
  const _map = useRef<MapView | null>(null);
  const [location, setLocation] = useState<Location>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });
  const Location = () => {
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        const init = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.005,
        };
        setLocation(init);
      },
      error => console.log('loi', error.message),
      {enableHighAccuracy: false, timeout: 10000, maximumAge: 1000},
    );
  };
  const getLocation = async () => {
    console.log('hi');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Location();
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    const permission = async () => {
      await getLocation();
    };
    permission();
  }, []);

  return (
    <View style={{flex: 1}}>
      <MapView
        ref={map => (_map.current = map)}
        style={useStyle.container}
        region={location}
        showsUserLocation={true}
        zoomEnabled={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsIndoors={true}
        onUserLocationChange={event => {
          _map.current?.animateToRegion({
            latitude : event.nativeEvent.coordinate?.latitude!,
            longitude : event.nativeEvent.coordinate?.longitude!,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          }, 500)
          setLocation({
            latitude : event.nativeEvent.coordinate?.latitude!,
            longitude : event.nativeEvent.coordinate?.longitude!,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          })
        }}
        followsUserLocation={true}
        >
          <Circle
                center = {location}
                strokeWidth = { 1 }
                radius={50}
                strokeColor = { '#1a66ff' }
                fillColor = { 'rgba(230,238,255,0.5)' }
        />
        </MapView>
    </View>
  );
};

export default App;
