import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Button,
  Alert,
} from 'react-native';

// Utils
import { getLocationId, getWeather, getCurrent, getFuture, getPredict } from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import getIconForWeather from './utils/getIconForWeather';

//dialog
import Dialog from "react-native-dialog";

// CLASS
export default class App extends React.Component {
  constructor(props) {
    super(props);


    // STATE
    this.state = {
      loading: false,
      error: false,
      location: '',
      weather: '',
      current_temp: 0,
      current_humid: 0,
      update_time: '',
      next_temp: 0,
      dialogVisible: false,
      custom_temp: '',
      custom_humid: ''
    };

  }
  // Life cycle
  componentDidMount() {
    this.handleUpdateLocation('Ho Chi Minh City');
  }

  // Update current location
  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {
        const ID = await getLocationId(city);
        const { location, weather } = await getWeather(ID);
        const {current_temp, current_humid, update_time } = await getCurrent();
        const next_temp = (await getFuture()).next;
        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          current_temp,
          current_humid,
          update_time,
          next_temp,
          dialogVisible: false,
        });


      } catch (e) {

        this.setState({
          loading: false,
          error: true,
        });

      }
    });
  };

//dialog event

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };
 
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  };
  
  handleSubmit = async () => {
    const {next_temp} = await getPredict(this.state.custom_temp, this.state.custom_humid)
    Alert.alert(
      "Weather after 1 hour!",
      "Temperature after 60 minutes with custom temperature and humidity is: " + Number((next_temp).toFixed(1)) + "°C",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
    this.setState({ dialogVisible: false });
  };
 

  // RENDERING
  render() {

    // GET values of state
    const { loading, error, location, weather, current_temp, current_humid, update_time, next_temp, dialogVisible, custom_temp, custom_humid } = this.state;


    //event handling

    const showAlertFutureWeather = () =>
      Alert.alert(
        "Weather after 1 hour!",
        "Temperature after 60 minutes is: " + Number((next_temp).toFixed(1)) + "°C",
        [
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
    );

    const reloadWeather = async () =>
    {
      this.setState({ loading: true }, async () => {
        try {
          const ID = await getLocationId('Ho Chi Minh City');
          const { location, weather } = await getWeather(ID);
          const {current_temp, current_humid, update_time } = await getCurrent();
          const next_temp = (await getFuture()).next;
          this.setState({
            loading: false,
            error: false,
            location,
            weather,
            current_temp,
            current_humid,
            update_time,
            next_temp,
            dialogVisible: false,
          });
  
        } catch (e) {
          this.setState({
            loading: false,
            error: true,
          });
  
        }
      });
    }
  

    // Activity
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">

        <StatusBar barStyle="light-content" />

        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >

          <View style={styles.detailsContainer}>

            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    😞 Could not load your city or weather. Please try again later...
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {getIconForWeather(weather)} {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                       {`${weather}\n`}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                       {`Temperature                 Humidity  `}
                    </Text>
                    <Text style={[styles.largeText, styles.textStyle]}>
                    {`${Math.round(current_temp)}°C`}       {`${Math.round(current_humid)}%`}
                    </Text>
                  </View>
                )}
                
                {!error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    {`\nLast update: ${update_time}\n`}
                  </Text>
                  
                )}
                {!error && (
                  <View style={[{margin: 10}]}>
                    <Button
                      onPress={reloadWeather}
                      title="Reload weather info"
                    />
                  </View>
                )}
                {!error && (
                  <View style={[{margin: 10}]}>
                    <Button
                      onPress={showAlertFutureWeather}
                      title="Get temperature after 60 minutes"
                    />
                  </View>
                )}
                {!error && (
                  <View style={[{margin: 10}]}>
                    <Button
                      onPress={this.showDialog}
                      title="Get future temperature with custom value"
                    />
                  </View>
                )}
                <View>
                  <Dialog.Container visible={dialogVisible}>
                    <Dialog.Title>Get future temperature with custom value</Dialog.Title>
                    <Dialog.Description>
                      Input your temperature and humidity to get 60 minutes later temperature.
                    </Dialog.Description>
                    <Dialog.Input 
                      label="Temperature"
                      keyboardType="decimal-pad"
                      onChangeText={custom_temp => this.setState({
                          custom_temp: custom_temp
                        })}
                      value={this.state.custom_temp}></Dialog.Input>
                    <Dialog.Input 
                      label="Humidity"
                      keyboardType="decimal-pad"
                      onChangeText={custom_humid => this.setState({
                          custom_humid: custom_humid
                        })}
                      value={this.state.custom_humid}></Dialog.Input>
                    <Dialog.Button label="Cancel" onPress={this.handleCancel} />
                    <Dialog.Button label="Submit" onPress={this.handleSubmit} />
                  </Dialog.Container>
                </View>
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

/* StyleSheet */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});
