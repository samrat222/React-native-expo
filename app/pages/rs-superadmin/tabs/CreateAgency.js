import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { ScrollView } from "react-native";
import { AuthContext } from "@/app/context/AuthContext";
import { useNavigation } from "@react-navigation/native";

// import DateTimePicker from "@react-native-community/datetimepicker";

const CreateAgency = () => {
  // const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  // const token = AsyncStorage.getItem("token");
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [allLocations, setAllLocations] = useState(null);
  const [regex, setRegex] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [allAgencySubscriptionTypes, setAllAgencySubscriptionTypes] =
    useState(null);
  // console.log(allLocations);

  const { user } = useContext(AuthContext);
  const { navigate } = useNavigation();

  const StepOneSchema = Yup.object().shape({
    agencyname: Yup.string().required("Agency Name is required!"),
    firstname: Yup.string().required("First Name is required!"),
    lastname: Yup.string().required("Last Name is required!"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneCode: Yup.string().required("Phone Code is required"),
    phone: Yup.string()
      .matches(/^[0-9]*$/, "Only numbers allowed!")
      .required("Phone number is required!")
      .min(9, "Phone number must be at least 9 digits long!")
      .max(9, "Phone number must be at most 9 digits long!"),
    landline: Yup.string()
      .matches(new RegExp(regex), "Invalid format")
      .required("Phone number is required!")
      .min(9, "Landline must be at least 8 digits long!")
      .max(9, "Landline must be at most 8 digits long!"),
    emirates: Yup.string().required("Emirates is required"),
    city: Yup.string().required("City is required"),
  });

  const StepTwoSchema = Yup.object().shape({
    startDate: Yup.string().required("Start Date is required"),
    validTillDate: Yup.string().required("Valid Date is required"),
    incentive: Yup.string()
      .matches(/^\d+(\.\d+)?$/)
      .required("Incentive is required"),
    subscriptionFrequency: Yup.string().required(
      "Subscription Frequency is required"
    ),
    subscriptionAmount: Yup.string()
      .matches(/^[0-9]*$/, "Only numbers allowed!")
      .required("Subscription Amount is required"),
  });

  const handleNext = async (validateForm) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const getLocations = async () => {
    // console.log("Hii there");
    try {
      const resp = await fetch(
        "https://rs-be.octopi-labs.com/api/1.0.0/ref/locations",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-JWT-Assertion": user,
          },
        }
      );
      console.log("token", user);

      if (resp.ok) {
        const response = await resp.json();
        setAllLocations(response.data);
        // console.log("resp", response.data);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const getInstallmentTypes = async () => {
    // console.log("Hello getInstallmentTypes");
    try {
      const resp = await fetch(
        "https://rs-be.octopi-labs.com/api/1.0.0/ref/agencySubscriptionTypes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-JWT-Assertion": user,
          },
        }
      );

      if (resp.ok) {
        const response = await resp.json();
        console.log("response :", response);
        setAllAgencySubscriptionTypes(response.data);
      }
    } catch (e) {
      console.log("Error", e);
    }
  };

  const initial = {
    agencyname: "",
    firstname: "",
    lastname: "",
    email: "",
    phoneCode: "+971",
    phone: "",
    landline: "",
    websiteUrl: "",
    emirates: "",
    city: "",
    startDate: "",
    validTillDate: "",
    incentive: "",
    subscriptionFrequency: "",
    subscriptionAmount: "",
  };

  const handleCreateAgency = async (value) => {
    try {
      // console.log("hiiiii");
      const request = {
        agencyName: value.agencyname,
        location: value.city,
        websiteURL: value.websiteUrl,
        firstName: value.firstname,
        lastName: value.lastname,
        email: value.email,
        countryCode: value.phoneCode,
        phoneNo: value.phone,
        landline: value.landline,
        bankName: "xyz",
        swiftCode: "234d",
        iban: "3456",
        commercialConfigDTO: {
          startDate: value.startDate,
          endDate: value.validTillDate,
          incentive: value.incentive,
          subscriptionFrequency: value.subscriptionFrequency,
          subscriptionAmount: value.subscriptionAmount,
        },
      };

      const resp = await fetch(
        "https://rs-be.octopi-labs.com//api/1.0.0/brokerAgency",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-JWT-Assertion": user,
          },
          body: JSON.stringify(request),
        }
      );

      if (resp.ok) {
        console.log("Agency Created successfully");
        navigate("SaDashboard");
      }
    } catch (e) {
      showMessage({
        message: "Something went wrong!",
        type: "danger",
      });
      console.log(e, "Error");
    }
  };

  const getCities = (cityId) => {
    const e = allLocations.find((obj) => obj.code === cityId);
    // console.log(e);
    return e ? e.subLocations : null;
  };

  const getRegexForCity = (selectedEmirate, selectedCity) => {
    const emirate = allLocations.find((obj) => obj.code === selectedEmirate);
    const city = emirate.subLocations.find((o) => o.name === selectedCity);
    return city.regularExp;
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShow(false);
    setStartDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  useEffect(() => {
    getInstallmentTypes();
    getLocations();
  }, []);

  return (
    <ScrollView>
      <Formik
        initialValues={initial}
        validationSchema={step === 1 ? StepOneSchema : StepTwoSchema}
        onSubmit={async (values, { validateForm }) => {
          if (step === 1) {
            validateForm().then((errors) => {
              if (Object.keys(errors).length === 0) {
                setStep(2);
              }
            });
          } else {
            handleCreateAgency(values);
          }
        }}
      >
        {({ values, errors, touched, handleSubmit, setFieldValue }) => (
          <View style={styles.container}>
            {step === 1 && (
              <>
                <Text style={styles.label}>Agency Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.agencyname &&
                      touched.agencyname &&
                      styles.errorInput,
                  ]}
                  placeholder="Agency Name *"
                  onChangeText={(text) => setFieldValue("agencyname", text)}
                  value={values.agencyname}
                />
                {errors.agencyname && touched.agencyname && (
                  <Text style={styles.errorText}>{errors.agencyname}</Text>
                )}

                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.firstname && touched.firstname && styles.errorInput,
                  ]}
                  placeholder="First Name *"
                  onChangeText={(text) => setFieldValue("firstname", text)}
                  value={values.firstname}
                />
                {errors.firstname && touched.firstname && (
                  <Text style={styles.errorText}>{errors.firstname}</Text>
                )}

                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.lastname && touched.lastname && styles.errorInput,
                  ]}
                  placeholder="Last Name *"
                  onChangeText={(text) => setFieldValue("lastname", text)}
                  value={values.lastname}
                />
                {errors.lastname && touched.lastname && (
                  <Text style={styles.errorText}>{errors.lastname}</Text>
                )}

                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.email && touched.email && styles.errorInput,
                  ]}
                  placeholder="Email *"
                  onChangeText={(text) => setFieldValue("email", text)}
                  value={values.email}
                />
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <Text style={styles.label}>Select Emirates</Text>
                <Picker
                  selectedValue={values.emirates}
                  onValueChange={(value) => {
                    // console.log("location", value);
                    setFieldValue("emirates", value);
                  }}
                  style={styles.picker}
                >
                  {allLocations &&
                    allLocations.map((location, i) => (
                      <Picker.Item
                        label={location.name}
                        value={location.code}
                        key={i}
                        enabled={location.code === "L0002"}
                      />
                    ))}
                </Picker>
                {errors.location && touched.location && (
                  <Text style={styles.errorText}>{errors.location}</Text>
                )}

                {values.emirates && (
                  <>
                    <Text style={styles.label}>City</Text>
                    <Picker
                      selectedValue={values.city}
                      onValueChange={(value) => {
                        console.log("city", value);
                        setFieldValue("city", value);
                        const regex = getRegexForCity(values.emirates, value);
                        setRegex(regex);
                      }}
                      style={styles.picker}
                    >
                      {getCities(values.emirates).map((city, j) => (
                        <Picker.Item
                          label={city.name}
                          key={j}
                          value={city.name}
                        />
                      ))}
                    </Picker>
                    {errors.city && touched.city && (
                      <Text style={styles.errorText}>{errors.city}</Text>
                    )}
                  </>
                )}

                <Text style={styles.label}>Phone Code</Text>
                <Picker
                  selectedValue={values.phoneCode}
                  onValueChange={(value) => setFieldValue("phoneCode", value)}
                  style={styles.picker}
                >
                  <Picker.Item label="+971" value="+971" />
                </Picker>
                {errors.phoneCode && touched.phoneCode && (
                  <Text style={styles.errorText}>{errors.phoneCode}</Text>
                )}

                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={[
                    styles.input,

                    errors.phone && touched.phone && styles.errorInput,
                  ]}
                  placeholder="Phone *"
                  onChangeText={(text) => setFieldValue("phone", text)}
                  value={values.phone}
                />
                {errors.phone && touched.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <Text style={styles.label}>Landline</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.landline && touched.landline && styles.errorInput,
                  ]}
                  placeholder="Eg: 04*******"
                  onChangeText={(text) => setFieldValue("landline", text)}
                  value={values.landline}
                />
                {errors.landline && touched.landline && (
                  <Text style={styles.errorText}>{errors.landline}</Text>
                )}

                <Text style={styles.label}>Website Url (Optional)</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.websiteUrl &&
                      touched.websiteUrl &&
                      styles.errorInput,
                  ]}
                  placeholder="Eg: https://website.com"
                  onChangeText={(text) => setFieldValue("websiteUrl", text)}
                  value={values.websiteUrl}
                />
                {errors.websiteUrl && touched.websiteUrl && (
                  <Text style={styles.errorText}>{errors.websiteUrl}</Text>
                )}

                <Button title="Next" onPress={handleSubmit} />
              </>
            )}
            {step === 2 && (
              <>
                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.startDate && touched.startDate && styles.errorInput,
                  ]}
                  placeholder="Start Date"
                  onChangeText={(text) => setFieldValue("startDate", text)}
                  value={values.startDate}
                />
                {/* <Text onPress={showDatePicker} style={styles.dateText}>
                  {startDate.toDateString()}
                </Text>
                {show && (
                  <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={onChange}
                  />
                )} */}

                {/* <DatePicker date={date} onDateChange={setDate} /> */}
                {errors.startDate && touched.startDate && (
                  <Text style={styles.errorText}>{errors.startDate}</Text>
                )}

                <Text style={styles.label}>Valid Till Date</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.validTillDate &&
                      touched.validTillDate &&
                      styles.errorInput,
                  ]}
                  placeholder="Valid Till Date"
                  onChangeText={(text) => setFieldValue("validTillDate", text)}
                  value={values.validTillDate}
                />
                {errors.validTillDate && touched.validTillDate && (
                  <Text style={styles.errorText}>{errors.validTillDate}</Text>
                )}

                <Text style={styles.label}>Incentive %</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.incentive && touched.incentive && styles.errorInput,
                  ]}
                  placeholder="Incentive % [Eg: 5] *"
                  onChangeText={(text) => setFieldValue("incentive", text)}
                  value={values.incentive}
                />
                {errors.incentive && touched.incentive && (
                  <Text style={styles.errorText}>{errors.incentive}</Text>
                )}

                <Text style={styles.label}>Subscription Frequency</Text>
                <Picker
                  selectedValue={values.subscriptionFrequency}
                  onValueChange={(value) => {
                    // console.log("location", value);
                    setFieldValue("subscriptionFrequency", value);
                  }}
                  style={styles.picker}
                >
                  {allAgencySubscriptionTypes.map((s, i) => (
                    <Picker.Item label={s.name} value={s.name} key={i} />
                  ))}
                </Picker>

                <Text style={styles.label}>Subscription Amount in AED</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.subscriptionAmount &&
                      touched.subscriptionAmount &&
                      styles.errorInput,
                  ]}
                  placeholder="Amount in AED [Eg: 20000] *"
                  onChangeText={(text) =>
                    setFieldValue("subscriptionAmount", text)
                  }
                  value={values.subscriptionAmount}
                />
                {errors.subscriptionAmount && touched.subscriptionAmount && (
                  <Text style={styles.errorText}>
                    {errors.subscriptionAmount}
                  </Text>
                )}

                <Button title="Go Back" onPress={() => setStep(1)} />
                <Button title="Create" onPress={handleSubmit} />
              </>
            )}
            {/* {loading && <ActivityIndicator size="large" color="#0000ff" />}
          <FlashMessage position="top" /> */}
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default CreateAgency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "700",
    color: "#3d3368",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "black",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
