import React, { useState, useEffect } from "react";

export default function HeroEditForm({ hero, onSave, onCancel, isEditing, setIsEditing }) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Initialize form data when hero changes or when editing starts
  useEffect(() => {
    if (hero && isEditing) {
      setFormData({
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
      setErrors({});
    }
  }, [hero, isEditing]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors[`${section}.${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: ""
      }));
    }
  };

  const handleArrayInputChange = (section, field, value) => {
    const arrayValue = value.split(",").map(item => item.trim()).filter(item => item);
    handleInputChange(section, field, arrayValue);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Validate powerstats (0-100 range)
    Object.entries(formData.powerstats).forEach(([key, value]) => {
      const numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        newErrors[`powerstats.${key}`] = "Must be a number between 0 and 100";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        biography: {
          ...formData.biography,
          aliases: formData.biography.aliases ? formData.biography.aliases.split(",").map(item => item.trim()).filter(item => item) : []
        },
        appearance: {
          ...formData.appearance,
          height: formData.appearance.height ? formData.appearance.height.split(",").map(item => item.trim()).filter(item => item) : [],
          weight: formData.appearance.weight ? formData.appearance.weight.split(",").map(item => item.trim()).filter(item => item) : []
        }
      };

      console.log("Form data being submitted:", submitData);
      await onSave(submitData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving hero:", error);
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

  // Don't render form if formData is not initialized
  if (!formData.name && !formData.powerstats) {
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Hero Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                    errors.name ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </div>

            {/* Powerstats */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Power Stats (0-100)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.powerstats).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-900 mb-2 capitalize">
                      {key}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => handleInputChange("powerstats", key, parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                        errors[`powerstats.${key}`] ? "border-red-500" : "border-gray-300 focus:border-blue-500"
                      }`}
                    />
                    {errors[`powerstats.${key}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`powerstats.${key}`]}</p>
                    )}
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
                  <input
                    type="text"
                    value={formData.biography.fullName}
                    onChange={(e) => handleInputChange("biography", "fullName", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={formData.biography.publisher}
                    onChange={(e) => handleInputChange("biography", "publisher", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Alignment
                  </label>
                  <select
                    value={formData.biography.alignment}
                    onChange={(e) => handleInputChange("biography", "alignment", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Alignment</option>
                    <option value="good">Good</option>
                    <option value="bad">Bad</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Place of Birth
                  </label>
                  <input
                    type="text"
                    value={formData.biography.placeOfBirth}
                    onChange={(e) => handleInputChange("biography", "placeOfBirth", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    First Appearance
                  </label>
                  <input
                    type="text"
                    value={formData.biography.firstAppearance}
                    onChange={(e) => handleInputChange("biography", "firstAppearance", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Alter Egos
                  </label>
                  <input
                    type="text"
                    value={formData.biography.alterEgos}
                    onChange={(e) => handleInputChange("biography", "alterEgos", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Aliases (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.biography.aliases}
                    onChange={(e) => setFormData(prev => ({ ...prev, biography: { ...prev.biography, aliases: e.target.value } }))}
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
                  <select
                    value={formData.appearance.gender}
                    onChange={(e) => handleInputChange("appearance", "gender", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Race
                  </label>
                  <input
                    type="text"
                    value={formData.appearance.race}
                    onChange={(e) => handleInputChange("appearance", "race", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Eye Color
                  </label>
                  <input
                    type="text"
                    value={formData.appearance.eyeColor}
                    onChange={(e) => handleInputChange("appearance", "eyeColor", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Hair Color
                  </label>
                  <input
                    type="text"
                    value={formData.appearance.hairColor}
                    onChange={(e) => handleInputChange("appearance", "hairColor", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Height (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.appearance.height}
                    onChange={(e) => setFormData(prev => ({ ...prev, appearance: { ...prev.appearance, height: e.target.value } }))}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    placeholder={'6\'2", 188 cm'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Weight (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.appearance.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, appearance: { ...prev.appearance, weight: e.target.value } }))}
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
                  <input
                    type="text"
                    value={formData.work.occupation}
                    onChange={(e) => handleInputChange("work", "occupation", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Base
                  </label>
                  <input
                    type="text"
                    value={formData.work.base}
                    onChange={(e) => handleInputChange("work", "base", e.target.value)}
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
                  <input
                    type="text"
                    value={formData.connections.groupAffiliation}
                    onChange={(e) => handleInputChange("connections", "groupAffiliation", e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Relatives
                  </label>
                  <input
                    type="text"
                    value={formData.connections.relatives}
                    onChange={(e) => handleInputChange("connections", "relatives", e.target.value)}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
