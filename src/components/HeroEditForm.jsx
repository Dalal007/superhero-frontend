import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  imageUrl: Yup.string().url("Must be a valid URL"),
  powerstats: Yup.object({
    intelligence: Yup.number().min(0, "Must be between 0 and 100").max(100, "Must be between 0 and 100").required(),
    strength: Yup.number().min(0, "Must be between 0 and 100").max(100, "Must be between 0 and 100").required(),
    speed: Yup.number().min(0, "Must be between 0 and 100").max(100, "Must be between 0 and 100").required(),
    durability: Yup.number().min(0, "Must be between 0 and 100").max(100, "Must be between 0 and 100").required(),
    power: Yup.number().min(0, "Must be between 0 and 100").max(100, "Must be between 0 and 100").required(),
    combat: Yup.number().min(0, "Must be between 0 and 100").max(100, "Must be between 0 and 100").required(),
  }),
  biography: Yup.object({
    fullName: Yup.string(),
    alterEgos: Yup.string(),
    aliases: Yup.string(),
    placeOfBirth: Yup.string(),
    firstAppearance: Yup.string(),
    publisher: Yup.string(),
    alignment: Yup.string(),
  }),
  appearance: Yup.object({
    gender: Yup.string(),
    race: Yup.string(),
    height: Yup.string(),
    weight: Yup.string(),
    eyeColor: Yup.string(),
    hairColor: Yup.string(),
  }),
  work: Yup.object({
    occupation: Yup.string(),
    base: Yup.string(),
  }),
  connections: Yup.object({
    groupAffiliation: Yup.string(),
    relatives: Yup.string(),
  }),
});

export default function HeroEditForm({ hero, onSave, onCancel, isEditing, setIsEditing }) {
  const [initialValues, setInitialValues] = useState({});

  // Initialize form data when hero changes or when editing starts
  useEffect(() => {
    if (hero && isEditing) {
      setInitialValues({
        name: hero?.name || "",
        imageUrl: hero?.imageUrl || "",
        powerstats: {
          intelligence: hero?.powerstats?.intelligence || 0,
          strength: hero?.powerstats?.strength || 0,
          speed: hero?.powerstats?.speed || 0,
          durability: hero?.powerstats?.durability || 0,
          power: hero?.powerstats?.power || 0,
          combat: hero?.powerstats?.combat || 0,
        },
        biography: {
          fullName: hero?.biography?.fullName || "",
          alterEgos: hero?.biography?.alterEgos || "",
          aliases: hero?.biography?.aliases?.join(", ") || "",
          placeOfBirth: hero?.biography?.placeOfBirth || "",
          firstAppearance: hero?.biography?.firstAppearance || "",
          publisher: hero?.biography?.publisher || "",
          alignment: hero?.biography?.alignment || "",
        },
        appearance: {
          gender: hero?.appearance?.gender || "",
          race: hero?.appearance?.race || "",
          height: hero?.appearance?.height?.join(", ") || "",
          weight: hero?.appearance?.weight?.join(", ") || "",
          eyeColor: hero?.appearance?.eyeColor || "",
          hairColor: hero?.appearance?.hairColor || "",
        },
        work: {
          occupation: hero?.work?.occupation || "",
          base: hero?.work?.base || "",
        },
        connections: {
          groupAffiliation: hero?.connections?.groupAffiliation || "",
          relatives: hero?.connections?.relatives || "",
        },
      });
    }
  }, [hero, isEditing]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare data for submission
      const submitData = {
        ...values,
        biography: {
          ...values.biography,
          aliases: values.biography.aliases ? values.biography.aliases.split(",").map(item => item.trim()).filter(item => item) : []
        },
        appearance: {
          ...values.appearance,
          height: values.appearance.height ? values.appearance.height.split(",").map(item => item.trim()).filter(item => item) : [],
          weight: values.appearance.weight ? values.appearance.weight.split(",").map(item => item.trim()).filter(item => item) : []
        }
      };

      console.log("Form data being submitted:", submitData);
      await onSave(submitData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving hero:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="btn bg-blue-600 hover:bg-blue-700 text-white"
      >
        ✏️ Edit Hero Details
      </button>
    );
  }

  // Don't render form if initialValues is not initialized
  if (!initialValues.name && !initialValues.powerstats) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <h2 className="text-3xl font-bold text-gray-900">Edit Hero Details</h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Hero Name *
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                        errors.name && touched.name ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Image URL
                    </label>
                    <Field
                      type="url"
                      name="imageUrl"
                      className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                        errors.imageUrl && touched.imageUrl ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    <ErrorMessage name="imageUrl" component="p" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Powerstats */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Power Stats (0-100)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(values.powerstats || {}).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-900 mb-2 capitalize">
                          {key}
                        </label>
                        <Field
                          type="number"
                          min="0"
                          max="100"
                          name={`powerstats.${key}`}
                          className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                            errors[`powerstats.${key}`] && touched[`powerstats.${key}`] ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                          }`}
                        />
                        <ErrorMessage name={`powerstats.${key}`} component="p" className="text-red-500 text-sm mt-1" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Biography */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Biography</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Full Name
                      </label>
                      <Field
                        type="text"
                        name="biography.fullName"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Publisher
                      </label>
                      <Field
                        type="text"
                        name="biography.publisher"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Alignment
                      </label>
                      <Field
                        as="select"
                        name="biography.alignment"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Select Alignment</option>
                        <option value="good">Good</option>
                        <option value="bad">Bad</option>
                        <option value="neutral">Neutral</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Place of Birth
                      </label>
                      <Field
                        type="text"
                        name="biography.placeOfBirth"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        First Appearance
                      </label>
                      <Field
                        type="text"
                        name="biography.firstAppearance"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Alter Egos
                      </label>
                      <Field
                        type="text"
                        name="biography.alterEgos"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Aliases (comma-separated)
                      </label>
                      <Field
                        type="text"
                        name="biography.aliases"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                        placeholder="Alias 1, Alias 2, Alias 3"
                      />
                    </div>
                  </div>
                </div>

                {/* Appearance */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Appearance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Gender
                      </label>
                      <Field
                        as="select"
                        name="appearance.gender"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white appearance-none cursor-pointer"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Field>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Race
                      </label>
                      <Field
                        type="text"
                        name="appearance.race"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Eye Color
                      </label>
                      <Field
                        type="text"
                        name="appearance.eyeColor"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Hair Color
                      </label>
                      <Field
                        type="text"
                        name="appearance.hairColor"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Height (comma-separated)
                      </label>
                      <Field
                        type="text"
                        name="appearance.height"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                        placeholder={'6\'2", 188 cm'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Weight (comma-separated)
                      </label>
                      <Field
                        type="text"
                        name="appearance.weight"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                        placeholder={'210 lbs, 95 kg'}
                      />
                    </div>
                  </div>
                </div>

                {/* Work */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Work</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Occupation
                      </label>
                      <Field
                        type="text"
                        name="work.occupation"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Base
                      </label>
                      <Field
                        type="text"
                        name="work.base"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Connections */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Connections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Group Affiliation
                      </label>
                      <Field
                        type="text"
                        name="connections.groupAffiliation"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Relatives
                      </label>
                      <Field
                        type="text"
                        name="connections.relatives"
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
