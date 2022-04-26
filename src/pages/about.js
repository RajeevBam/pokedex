import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";


const AboutComp = ({ navigation, route }) => {
  const [imageURL, setImageURL] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  const [types, setTypes] = useState([]);
  const [dimension, setDimension] = useState({});
  const [about, setAbout] = useState("");

  const [rotateAnimation, setRotateAnimation] = useState(new Animated.Value(0));

  useEffect(
    () =>
      fetch("https://pokeapi.co/api/v2/pokemon/" + route.params.id)
        .then((response) => response.json())
        .then((data) => {
          setPokemonName(data["name"].toUpperCase());
          const dataTypes = data["types"].map((type) => type.type.name);
          setTypes(dataTypes);
          setDimension({ height: data["height"], weight: data["weight"] });
          setImageURL(
            data["sprites"]["other"]["official-artwork"]["front_default"]
          );
        })
        .then(() =>
          fetch("https://pokeapi.co/api/v2/pokemon-species/" + route.params.id)
        )
        .then((res) => res.json())
        .then((aboutData) => {
          setAbout(aboutData["flavor_text_entries"][6]["flavor_text"]);
        }),
    [route.params.id]
  );
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const handleAnimation = () => {
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 800,
    }).start(() => {
      rotateAnimation.setValue(0);
    });
  };

  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  const animatedStyle = {
    height: 250,
    width: 250,
    alignSelf: "center",
    transform: [
      {
        rotate: interpolateRotating,
      },
    ],
  };
  const height = dimension.height / 10;
  const weight = dimension.weight / 10;
  const description = about.replace(/\n/g, "");
  return (
    <View>
      <LinearGradient
        style={styles.container}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={["pink", "purple", "blue"]}
      >
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            padding: 15,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Icon
              name="arrow-left"
              size={22}
              color="#fff"
              style={{ margin: 5 }}
              onPress={() => navigation.goBack()}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
                marginHorizontal: 30,
              }}
            >
              <Text style={[styles.textStyle, styles.nameStyle]}>
                {pokemonName}
              </Text>
              <Text style={styles.textStyle}>{`#${route.params.id}`}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 30,
                marginVertical: 20,
              }}
            >
              {types.map((type, i) => (
                <View key={i} style={styles.typeStyle}>
                  <Text style={styles.textStyle}>{type}</Text>
                </View>
              ))}
            </View>

            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                onPress={async () => handleAnimation()}
                style={{ width: 50 }}
              >
                <Animated.Image
                  source={{uri: imageURL }}
                  style={animatedStyle}
                ></Animated.Image>
              </TouchableOpacity>
            </View>
            <Animated.View
              style={{
                transform: [{ translateX: pan.x }, { translateY: pan.y }], useNativeDriver:true
              }}
              {...panResponder.panHandlers}
            >
          
            <Card style={styles.card}>
              <View style={{ alignItems: "flex-start", padding: 10 }}>
                <Text
                  style={{ fontWeight: "bold", color: "#fff", fontSize: 20 }}
                >
                  About:{" "}
                </Text>
                <Text style={styles.textStyle}>{description}</Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      fontStyle: "italic",
                    }}
                  >
                    Height:
                  </Text>
                  <Text style={styles.textStyle}>{height} m</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#fff",
                      fontStyle: "italic",
                    }}
                  >
                    Weight:
                  </Text>
                  <Text style={styles.textStyle}>{weight} kg</Text>
                </View>
              </View>
            </Card>
            </Animated.View>
          </View>
          <TouchableOpacity
            style={styles.evolutionButton}
            onPress={() =>
              navigation.navigate("Evolution", { id: route.params.id })
            }
          >
            <Text>Evolution</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
    },
    card: {
      width: "90%",
      alignSelf: "center",
      padding: 10,
      backgroundColor: "transparent",
      opacity: 0.8,
    },
  
    textStyle: {
      color: "#fff",
      fontSize: 15,
    },
    nameStyle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    typeStyle: {
      borderRadius: 15,
      backgroundColor: "#00BCD4",
      padding: 5,
      paddingHorizontal: 15,
      marginRight: 15,
    },
    evolutionButton: {
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      width: "80%",
      padding: 10,
      backgroundColor: "#66BB6A",
      margin: 30,
    },
  });
export default AboutComp;
