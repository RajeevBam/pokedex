import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Button,
  ScrollView,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { Card } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

const AboutComp = ({ navigation, route }) => {
  const [imageURL, setImageURL] = useState("");
  const [pokemonName, setPokemonName] = useState("");
  const [types, setTypes] = useState([]);
  const [dimension, setDimension] = useState({});
  useEffect(
    () =>
      fetch("https://pokeapi.co/api/v2/pokemon/" + route.params.id)
        .then((response) => response.json())
        .then((data) => {
          setPokemonName(data["name"].toUpperCase());
          const dataTypes = data["types"].map((type) => type.type.name);
          setTypes(dataTypes);
          setDimension({ height: data["height"], weight: data["weight"] });
          return data["sprites"]["front_default"];
        })
        .then((url) => setImageURL(url)),
    [route.params.id]
  );
  const height= (dimension.height)/10;
  const weight= (dimension.weight)/10;
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
            <Image source={{ uri: imageURL }} style={styles.imageStyle} />
            <Card style={styles.card}>
              <View style={{ alignItems: "flex-start" ,padding:10}}>
                <Text style={{ fontWeight: "bold", color: "#fff" }}>About: </Text>
                <Text style={styles.textStyle}>Description Goes there</Text>
              </View>
              <View
                style={{ flexDirection: "row", justifyContent: "space-evenly" }}
              >
                <View style={{ alignItems: "center"}}>
                  <Text style={{ fontWeight: "bold" , color: "#fff"}}>Height</Text>
                  <Text style={styles.textStyle}>{height} m</Text>
                </View>
                <View style={{ alignItems: "center" } }>
                  <Text style={{ fontWeight: "bold" , color: "#fff"}}>Weight</Text>
                  <Text style={styles.textStyle}>{weight} kg</Text>
                </View>
              </View>
            </Card>
          </View>
          <TouchableOpacity style={styles.evolutionButton}>
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
    backgroundColor: 'transparent',
    opacity: 0.5,
  },

  textStyle: {
    color: "#fff",
  },
  nameStyle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  imageStyle: {
    height: 250,
    width: 250,
    alignSelf: "center",
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
    margin: 10,
  },
});

export default AboutComp;
