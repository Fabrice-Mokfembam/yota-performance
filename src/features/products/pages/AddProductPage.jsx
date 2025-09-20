import React, { useState } from "react";
import { useAddProduct, useUploadImages } from "../hooks/useProducts";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import FormRadioGroup from "../components/FormRadioGroup";
import FormTextEditor from "../components/FormTextEditor";
import ImageUpload from "../components/ImageUpload";
import ProductPreview from "../components/ProductPreview";
import { Eye, EyeOff, Upload, X, Check } from "lucide-react";
import {
  categories,
  carModels,
  performanceCategories,
  performanceSubcategories,
  performanceFinalCategories,
  ExhaustSubCategory,
  SuspensionPartsSubCategory,
} from "../../../data";
import {
  itemsOther,
  itemsInterior,
  itemsExterior,
  itemsLighting,
  itemsBodykits,
} from "../../../data";

const AddProductPage = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    sku: "",
    price: "",
    quantity_left: "",
    car_brand: "",
    car_model: "",
    make_material: "",
    hot_product: false,
    performance_part: false,
    fit_position: "",
    category: "",
    subcategory: "",
    final_subcategory: "",
    category_brand: "",
    wheel_size: "",
    description: "",
    features: "",
    fitment: "",
    video: "",
    shipment: "1", // Default to 1 Business Day
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const addProductMutation = useAddProduct();
  const uploadImagesMutation = useUploadImages();

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // If car model changes, clear category selection if it's no longer available
      if (field === "car_model") {
        const availableCategories = getCategoryOptions();
        const currentCategory = newData.category;
        
        // Check if current category is still available
        const isCategoryStillAvailable = availableCategories.some(
          cat => cat.value === currentCategory
        );
        
        if (currentCategory && !isCategoryStillAvailable) {
          newData.category = "";
          newData.subcategory = "";
          newData.final_subcategory = "";
        }
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({ ...prev, images }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.product_name)
      newErrors.product_name = "Product name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";
    if (!formData.sku) newErrors.sku = "SKU is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      // Upload images first
      if (formData.images.length > 0) {
        const formDataImages = new FormData();
        formData.images.forEach((image) => {
          formDataImages.append("imageFiles[]", image.file);
        });

        const uploadResult = await uploadImagesMutation.mutateAsync(
          formDataImages
        );
        console.log("Upload result:", uploadResult);
      }

      // Prepare product data
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        quantity_left: Number.parseFloat(formData.quantity_left),
        images: formData.images.map((img) => img.name),
        rating: 1,
      };
       console.log(productData)
      // Add product
      await addProductMutation.mutateAsync(productData);

      // Reset form
      setFormData({
        product_name: "",
        sku: "",
        price: "",
        quantity_left: "",
        car_brand: "",
        car_model: "",
        make_material: "",
        hot_product: false,
        performance_part: false,
        fit_position: "",
        category: "",
        subcategory: "",
        final_subcategory: "",
        category_brand: "",
        wheel_size: "",
        description: "",
        features: "",
        fitment: "",
        video: "",
        shipment: "1",
        images: [],
      });

      setShowPreview(false);
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  // Check if the selected car model is eligible for special categories
  const isEligibleForSpecialCategories = () => {
    if (!formData.car_model) return false;
    
    const specialModels = [
      "MK4 SUPRA (A80) (1993 - 2002)",
      "MK5 GR SUPRA (A90) (2019 - Present)",
      "ZN6 (Toyota GR86) (2012 - 2020)",
      "ZN7/ZN8 (Toyota GR86) (2021 - Present)",
      "Toyota Corolla GR (2023+)"
    ];
    
    return specialModels.includes(formData.car_model);
  };

  // Check if the selected car model is eligible for Fog Lights
  const isEligibleForFogLights = () => {
    if (!formData.car_model) return false;
    
    // Fog Lights available for all Toyota Camry and Toyota Corolla models EXCEPT 2023+ GR Corolla
    const fogLightsEligibleModels = [
      "8th gen Toyota Camry (2018 - 2024)",
      "7th gen Toyota Camry (2015 - 2017)",
      "12th gen Toyota Corolla (2019+)",
      "11th gen Toyota Corolla (2014 - 2019)"
    ];
    
    return fogLightsEligibleModels.includes(formData.car_model);
  };

  const getCategoryOptions = () => {
    if (!formData.fit_position) return [];

    switch (formData.fit_position) {
      case "other":
        return itemsOther.map((item) => ({
          value: item.text,
          label: item.text,
        }));
      case "interior": {
        // Filter out "Roll Bars" if not eligible for special categories
        const interiorItems = itemsInterior.filter(item => {
          if (item.text === "Roll Bars") {
            return isEligibleForSpecialCategories();
          }
          return true;
        });
        return interiorItems.map((item) => ({
          value: item.text,
          label: item.text,
        }));
      }
      case "exterior": {
        // Filter out special exterior items if not eligible
        const exteriorItems = itemsExterior.filter(item => {
          const specialExteriorItems = ["License plate", "Roof Top", "Doors"];
          if (specialExteriorItems.includes(item.text)) {
            return isEligibleForSpecialCategories();
          }
          return true;
        });
        return exteriorItems.map((item) => ({
          value: item.text,
          label: item.text,
        }));
      }
      case "aero kits":
        return itemsBodykits.map((item) => ({
          value: item.text,
          label: item.text,
        }));
      case "lighting": {
        // Filter out "Fog lights" if not eligible for fog lights
        const lightingItems = itemsLighting.filter(item => {
          if (item.text === "Fog lights") {
            return isEligibleForFogLights();
          }
          return true;
        });
        return lightingItems.map((item) => ({
          value: item.text,
          label: item.text,
        }));
      }
      default:
        return [];
    }
  };

  const getSubcategoryOptions = () => {
    if (formData.category === "Exhaust") {
      return ExhaustSubCategory;
    } else if (formData.category === "Suspension parts") {
      return SuspensionPartsSubCategory;
    }
    return [];
  };

  const getPerformanceSubcategoryOptions = () => {
    return performanceSubcategories[formData.category] || [];
  };

  const getPerformanceFinalCategoryOptions = () => {
    return performanceFinalCategories[formData.subcategory] || [];
  };

  const getFilteredCarModels = () => {
    return carModels.filter((carModel) => {
      if (formData.car_brand === "Toyota Corolla") {
        return carModel.label.includes("Corolla");
      } else if (formData.car_brand === "Toyota Camry") {
        return carModel.label.includes("Camry");
      } else if (formData.car_brand === "Toyota GR86") {
        return carModel.label.includes("GR86");
      } else if (formData.car_brand === "Toyota Supra") {
        return carModel.label.includes("SUPRA");
      }
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the product details below
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-8">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      Performance Part
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          "performance_part",
                          !formData.performance_part
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.performance_part
                          ? "bg-blue-600"
                          : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.performance_part
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <FormInput
                  label="Product Name"
                  value={formData.product_name}
                  onChange={(e) =>
                    handleInputChange("product_name", e.target.value)
                  }
                  placeholder="Enter product name"
                  required
                  error={errors.product_name}
                />

                <ImageUpload
                  label="Product Images"
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  required
                  error={errors.images}
                />
<div className="flex gap-2">
  <FormInput
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="0.00"
                  required
                  error={errors.price}
                />

                <FormInput
                  label="Quantity Available"
                  type="number"
                  value={formData.quantity_left}
                  onChange={(e) =>
                    handleInputChange("quantity_left", e.target.value)
                  }
                  placeholder="0"
                  required
                  error={errors.quantity_left}
                />

</div>
                

                {formData.quantity_left === "-1" && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h3 className="text-sm font-medium text-yellow-800 mb-2">
                      Special Order Shipping Information
                    </h3>
                    <FormRadioGroup
                      label="Shipping Time"
                      value={formData.shipment}
                      onChange={(e) =>
                        handleInputChange("shipment", e.target.value)
                      }
                      options={[
                        { value: "5-7", label: "Ships within 5-7 Business Days" },
                        { value: "7-10", label: "Ships within 7-10 Business Days" },
                        { value: "14-21", label: "Ships within 2-3 weeks" },
                        { value: "30", label: "Ships within 1 month (ETA Time is 1 month)" },
                      ]}
                      required
                    />
                  </div>
                )}

                <FormRadioGroup
                  label="Car Brand"
                  value={formData.car_brand}
                  onChange={(e) =>
                    handleInputChange("car_brand", e.target.value)
                  }
                  options={[
                    { value: "Toyota Corolla", label: "Toyota Corolla" },
                    { value: "Toyota Camry", label: "Toyota Camry" },
                    { value: "Toyota GR86", label: "Toyota GR86" },
                    { value: "Toyota Supra", label: "Toyota Supra" },
                  ]}
                  required
                  error={errors.car_brand}
                />

                <FormRadioGroup
                  label="Car Model"
                  value={formData.car_model}
                  onChange={(e) =>
                    handleInputChange("car_model", e.target.value)
                  }
                  options={getFilteredCarModels()}
                  required
                  error={errors.car_model}
                />

                <FormRadioGroup
                  label="Hot Product"
                  value={formData.hot_product}
                  onChange={(e) =>
                    handleInputChange("hot_product", e.target.value === "true")
                  }
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />

                <FormRadioGroup
                  label="Make Material"
                  value={formData.make_material}
                  onChange={(e) =>
                    handleInputChange("make_material", e.target.value)
                  }
                  options={[
                    { value: "carbon fiber", label: "Carbon Fiber" },
                    { value: "Other", label: "Other" },
                  ]}
                />
              </div>

              <div className="space-y-6">
                {!formData.performance_part && (
                  <FormRadioGroup
                    label="Category Type"
                    value={formData.fit_position}
                    onChange={(e) =>
                      handleInputChange("fit_position", e.target.value)
                    }
                    options={categories}
                    required
                    error={errors.fit_position}
                  />
                )}
                   {!formData.performance_part && formData.fit_position && (
                  <FormRadioGroup
                    label="Category"
                    value={formData.category}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    options={getCategoryOptions()}
                    required
                    error={errors.category}
                  />
                )}

                {!formData.performance_part && formData.category && (
                  <FormRadioGroup
                    label="Sub-Category"
                    value={formData.subcategory}
                    onChange={(e) =>
                      handleInputChange("subcategory", e.target.value)
                    }
                    options={getSubcategoryOptions()}
                  />
                )}

                {formData.performance_part && (
                  <>
                    <FormRadioGroup
                      label="Performance Category"
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      options={performanceCategories}
                      required
                      error={errors.category}
                    />

                    {formData.category && (
                      <FormRadioGroup
                        label="Performance Subcategory"
                        value={formData.subcategory}
                        onChange={(e) =>
                          handleInputChange("subcategory", e.target.value)
                        }
                        options={getPerformanceSubcategoryOptions()}
                      />
                    )}

                    {formData.subcategory && (
                      <FormRadioGroup
                        label="Performance Final Category"
                        value={formData.final_subcategory}
                        onChange={(e) =>
                          handleInputChange("final_subcategory", e.target.value)
                        }
                        options={getPerformanceFinalCategoryOptions()}
                      />
                    )}
                  </>
                )}

                {formData.category === "Wheel" &&
                  !formData.performance_part && (
                    <FormRadioGroup
                      label="Category Brand"
                      value={formData.category_brand}
                      onChange={(e) =>
                        handleInputChange("category_brand", e.target.value)
                      }
                      options={[
                        { value: "Kansei", label: "Kansei" },
                        { value: "Enkei", label: "Enkei" },
                        { value: "Advan Racing", label: "Advan Racing" },
                        { value: "Bc Forged", label: "Bc Forged" },
                        { value: "Volk Racing", label: "Volk Racing" },
                        { value: "FR1", label: "FR1" },
                      ]}
                    />
                  )}

                {formData.category === "Wheel" &&
                  !formData.performance_part && (
                    <FormInput
                      label="Wheel Size"
                      value={formData.wheel_size}
                      onChange={(e) =>
                        handleInputChange("wheel_size", e.target.value)
                      }
                      placeholder="e.g., 18x8.5"
                    />
                  )}

                {/* YouTube Video ID for all products */}
                <FormInput
                  label="YouTube Video ID"
                  value={formData.video}
                  onChange={(e) => handleInputChange("video", e.target.value)}
                  placeholder="Enter YouTube video ID"
                />
                
                {/* YouTube Video Preview */}
                {formData.video && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Video Preview
                    </label>
                    <div className="relative w-full max-w-2xl">
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${formData.video}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="rounded-lg shadow-sm"
                      ></iframe>
                    </div>
                  </div>
                )}

                <FormInput
                  label="SKU"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Enter product SKU"
                  required
                  error={errors.sku}
                />

                <FormTextEditor
                  label="Fitment"
                  value={formData.fitment}
                  onChange={(value) => handleInputChange("fitment", value)}
                  placeholder="Enter fitment information..."
                />

                <FormTextEditor
                  label="Description"
                  value={formData.description}
                  onChange={(value) => handleInputChange("description", value)}
                  placeholder="Enter product description..."
                />

                <FormTextEditor
                  label="Features"
                  value={formData.features}
                  onChange={(value) => handleInputChange("features", value)}
                  placeholder="Enter product features..."
                />

             
                

                
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handlePreview}
                className="px-6 py-2 text-blue-600 bg-blue-50 border border-blue-600 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Preview Product
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={addProductMutation.isPending}
                className="px-6 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addProductMutation.isPending
                  ? "Adding Product..."
                  : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <ProductPreview
          product={formData}
          onClose={() => setShowPreview(false)}
          onConfirm={handleSubmit}
          onCancel={() => setShowPreview(false)}
          isLoading={addProductMutation.isPending}
        />
      )}
    </div>
  );
};

export default AddProductPage;