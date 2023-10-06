import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Button,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
  Image,
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

type Pokemon = {
  id : string,
  name: string,
  location : Location,
  avatar : any,
}

const Data : Array<Pokemon>  = [
  {
    id : '1',
    name : "Vit",
    location : {
      latitude: 10.4114,
      longitude: 107.1362,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    },
    avatar : require('./src/assets/vit.png')
  },
  {
    id : '2',
    name : "Vit",
    location : {
      latitude: 10.3395,
      longitude: 107.0903,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    },
    avatar : require('./src/assets/vit.png')

  },
  {
    id : '3',
    name : "Vit",
    location : {
      latitude: 10.3376,
      longitude: 107.0898,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    },
    avatar : require('./src/assets/vit.png')

  },
  {
    id : '4',
    name : "Vit",
    location : {
      latitude: 10.3310,
      longitude: 107.0799,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    },
    avatar : require('./src/assets/vit.png')

  },
  {
    id : '5',
    name : "Vit",
    location : {
      latitude: 10.3220,
      longitude: 107.0836,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    },
    avatar : require('./src/assets/vit.png')

  },
  {
    id : '6',
    name : "Vit",
    location : {
      latitude: 10.3397,
      longitude: 107.0882,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    },
    avatar : require('./src/assets/vit.png')

  },
  {
    id : '7',
    name : "Vit",
    location : {
      latitude: 10.3402,
      longitude: 107.0886,
      latitudeDelta: 0.01,
      longitudeDelta: 0.005,
    },
    avatar : require('./src/assets/vit.png')

  },
]



function distance(coords1: Location, coords2: Location) {
  const {latitude: lat1, longitude: lon1} = coords1;
  const {latitude: lat2, longitude: lon2} = coords2;
  const degToRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const halfDLat = degToRad(lat2 - lat1) / 2;
  const halfDLon = degToRad(lon2 - lon1) / 2;
  const a =
    Math.sin(halfDLat) * Math.sin(halfDLat) +
    Math.cos(degToRad(lat1)) *
      Math.cos(degToRad(lat2)) *
      Math.sin(halfDLon) *
      Math.sin(halfDLon);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // 100
}
const App = () => {
  const _map = useRef<MapView | null>(null);
  const [havePokemon, setHavePokemon] = useState(false);
  const [focus, setFocus] = useState(true);
  const [marker, setMarker] = useState<Location>({
    latitude: 10.4114,
    longitude: 107.1362,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });
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
          title: 'Cool Pokemon App Location Permission',
          message: 'Cool Pokemon App Location',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Location();
      } else {
        console.log('Location permission denied');
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
    if (distance(location, marker) <= 100) {
      setHavePokemon(true);
    } 
    else {
      setHavePokemon(false);
    }

  }, [location.latitude, location.longitude, marker]);

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
          if (!focus) return;
          const lalo = {
            latitude: event.nativeEvent.coordinate?.latitude!,
            longitude: event.nativeEvent.coordinate?.longitude!,
            latitudeDelta: 0.01,
            longitudeDelta: 0.005,
          };
          _map.current?.animateToRegion(lalo, 500);
          setLocation(lalo);
        }}>
        <Circle
          center={location}
          strokeWidth={1}
          radius={100}
          strokeColor={'#1a66ff'}
          fillColor={'rgba(230,238,255,0.5)'}
        />
        <Marker
          draggable
          onDragEnd={event => {
            setMarker({
              latitude: event.nativeEvent.coordinate?.latitude!,
              longitude: event.nativeEvent.coordinate?.longitude!,
              latitudeDelta: 0.01,
              longitudeDelta: 0.005,
            });
          }}
          coordinate={marker!}
          title={'huy'}
          description={'Nè'}>
          <Image
            source={require('./src/assets/chansey.png')}
            style={{width: 35, height: 25}}
            resizeMode="contain"
          />
        </Marker>
        {Data.map((item) => {
          return <Marker   
          key={item.id}     
          coordinate={item.location!}
          title={item.name}
          description={'Nè'}>
          <Image
            source={item.avatar}
            style={{width: 35, height: 25}}
            resizeMode="contain"
          />
        </Marker>
        })}
      </MapView>
      <View style={{width: '100%', position: 'absolute', bottom: 10, left : 10, right : 10}}>
        {havePokemon ? (
          <View style={{width: '100%', padding: 10, backgroundColor: '#DDDDDD'}}>
            <Text>
              {' '}
              Có pokemon ở gần đây cách bạn {' '}
              {distance(location, marker).toFixed()}m{' '}
            </Text>
          </View>
        ) : null}
        {Data.map((item) => {
          if(distance(location, item.location) > 100) return
          return <View style={{width: '80%', padding: 10, backgroundColor: '#DDDDDD', marginVertical: 5, borderRadius: 30}}>
          <Text>
            {' '}
            Có pokemon {item.name} ở gần đây cách bạn{' '}
            {distance(location, item.location).toFixed()}m{' '}
          </Text>
        </View>
        })}
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableHighlight
            style={{
              ...useStyle.button,
              backgroundColor: focus ? 'yellow' : '#DDDDDD',
            }}
            onPress={() => {
              setFocus(!focus);
            }}>
            <Text>Focus</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              ...useStyle.button,
            }}
            onPress={() => {
              console.log('result', distance(location, marker));
            }}>
            <Text>Find Pokemon</Text>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

export default App;
