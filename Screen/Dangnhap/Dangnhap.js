import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Colors, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { Button } from "galio-framework";

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;

const Banner = (props) => {
  //#region Animated
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  //#endregion
  return (
    <Animated.View // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
};

export default function Dangnhap() {
  const navigation = useNavigation();
  const [data, setData] = useState({
    Tinh: "Chọn Tỉnh/Thành phố",
  });
  const [picker, setPicker] = useState({
    IDTinh: [
      {
        id: "",
        name: "Chọn Tỉnh/Thành phố",
      },
    ],
  });
  console.log(data.Tinh);
  //* Chọn giá trị cho Picker
  const changeValuePicker = (arg) => {
    setData((prevState) => ({
      ...prevState,
      ...arg,
    }));
  };
  //#region API - Call
  //* Tỉnh:
  useEffect(() => {
    fetch(
      "http://tuyensinh.huongvietedm.vn/api/TSAPIService/getaddress?idParent=1&level=1"
    )
      .then((response) => response.json())
      .then((responseJson) => {
        const arrData = [
          {
            id: "",
            name: "Chọn Tỉnh/Thành phố",
          },
        ];
        responseJson.Result.results.map((item, index) => {
          const obj = {
            id: item.ID,
            name: item.TenDiaChi,
          };
          arrData.push(obj);
        });
        setPicker((prevState) => ({
          ...prevState,
          IDTinh: arrData,
        }));
      })
      .catch((error) => {
        const arrDataFail = [
          {
            id: "",
            name: "Chọn Tỉnh/Thành phố",
          },
        ];
        setPicker((prevState) => ({
          ...prevState,
          IDTinh: arrDataFail,
        }));
      });
  }, [0]);
  //#endregion

  return (
    <View style={styles.container}>
      {data.Tinh !== "Chọn Tỉnh/Thành phố" ? (
        <Banner>
          <Text
            style={{
              fontSize: 28,
              textAlign: "center",
              margin: 10,
              position: "absolute",
              top: height / 5,
              alignSelf: "center",
              fontWeight: "bold",
              color: "#FFF",
              textShadowColor: "rgba(0, 0, 0, 1)",
              textShadowOffset: { width: -1, height: 1 },
              textShadowRadius: 10,
            }}
          >
            Chào mừng đến với hệ thống đăng ký và tra cứu tuyển sinh đầu cấp của{" "}
            {data.Tinh}
          </Text>
        </Banner>
      ) : (
        <Text
          style={{
            fontSize: 28,
            textAlign: "center",
            margin: 10,
            position: "absolute",
            top: height / 5,
            alignSelf: "center",
            fontWeight: "bold",
            color: "#FFF",
            textShadowColor: "rgba(0, 0, 0, 1)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
          }}
        >
          Vui lòng chọn tỉnh/thành phố bạn muốn tra cứu
        </Text>
      )}

      <ImageBackground
        source={require("../../assets/background.png")}
        style={{
          width: "100%",
          height: "100%",

          alignItems: "center",
          justifyContent: "center",
          zIndex: -1,
        }}
        blurRadius={1.5}
      >
        <StatusBar hidden />

        <View style={[styles.field, { marginHorizontal: 10 }]}>
          {data.Tinh == "Chọn Tỉnh/Thành phố" ? null : (
            <View style={styles.label}>
              <IconButton
                style={{ backgroundColor: "#61b15a" }}
                icon="check"
                color="#FFFF"
                size={10}
              />
            </View>
          )}
          <Picker
            selectedValue={data.Tinh}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              changeValuePicker({ Tinh: itemValue })
            }
            dropdownIconColor={
              data.IDTinh == "" || null ? Colors.red500 : "#61b15a"
            }
          >
            {picker.IDTinh.map((item, index) => {
              return (
                <Picker.Item
                  key={index.toString()}
                  label={item.name}
                  value={item.name}
                />
              );
            })}
          </Picker>
        </View>
        {data.Tinh !== "Chọn Tỉnh/Thành phố" && (
          <Button
            round
            style={styles.button}
            onPress={() =>
              navigation.navigate("Trang chủ", { Tinh: data.Tinh })
            }
          >
            Đăng nhập
          </Button>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  field: {
    borderColor: "white",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    padding: 5,
    marginBottom: "2%",
    flexDirection: "row",

    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  label: {
    alignSelf: "center",
    // marginRight: 10,
  },
  picker: {
    height: 50,
    flexGrow: 1,
  },
  button: {
    height: 50,
    width: 150,
    borderRadius: 25,
    alignSelf: "center",
    textShadowColor: "black",
    backgroundColor: "#61b15a",
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 13 },
  },
});
