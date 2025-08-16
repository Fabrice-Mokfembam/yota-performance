import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProduct, useUpdateProduct, useUploadImages } from '../hooks/useProducts';
import FormInput from '../components/FormInput';
import FormRadioGroup from '../components/FormRadioGroup';
import FormTextEditor from '../components/FormTextEditor';
import ImageUpload from '../components/ImageUpload';
import ProductPreview from '../components/ProductPreview';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { 
  categories, 
  carModels, 
  performanceCategories, 
  performanceSubcategories, 
  performanceFinalCategories,
  ExhaustSubCategory,
  SuspensionPartsSubCategory
} from '../../../data';
import { 
  itemsOther, 
  itemsInterior, 
  itemsExterior, 
  itemsLighting, 
  itemsBodykits 
} from '../../../data';

const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id);
  const updateProductMutation = useUpdateProduct();
  const uploadImagesMutation = useUploadImages();

  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    quantity_left: '',
    car_brand: '',
    car_model: '',
    make_material: '',
    hot_product: false,
    performance_part: false,
    fit_position: '',
    category: '',
    subcategory: '',
    final_subcategory: '',
    category_brand: '',
    wheel_size: '',
    description: '',
    features: '',
    fitment: '',
    video: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  // Populate form data when product data is available
  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name || '',
        price: product.price?.toString() || '',
        quantity_left: product.quantity_left?.toString() || '',
        car_brand: product.car_brand || '',
        car_model: product.car_model || '',
        make_material: product.make_material || '',
        hot_product: product.hot_product || false,
        performance_part: product.performance_part || false,
        fit_position: product.fit_position || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        final_subcategory: product.final_subcategory || '',
        category_brand: product.category_brand || '',
        wheel_size: product.wheel_size || '',
        description: product.description || '',
        features: product.features || '',
        fitment: product.fitment || '',
        video: product.video || '',
        images: product.images || []
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name) newErrors.product_name = 'Product name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Upload new images first if any
    const newImages = formData.images.filter(img => img.file);

    if (newImages.length > 0) {
      const formDataImages = new FormData();
      newImages.forEach(image => {
        formDataImages.append('imageFiles[]', image.file);
      });

      // Upload images mutation with callbacks
      uploadImagesMutation.mutate(formDataImages, {
        onSuccess: (uploadResult) => {
          console.log('Upload result:', uploadResult);

          // Prepare product data for update after successful upload
          const productData = {
            ...formData,
            price: Number.parseFloat(formData.price),
            quantity_left: Number.parseFloat(formData.quantity_left),
            images: formData.images.map(img => img.name),
            rating: product?.rating || 0,
          };

          console.log('productt to be updated',{ id, data: productData })

          // Update product mutation with callbacks
          updateProductMutation.mutate({ id, data: productData }, {
            onSuccess: () => {
              toast.success('Product updated successfully!');
              navigate(`/products/detail/${id}`);
            },
            onError: (error) => {
              console.error('Error updating product:', error);
              toast.error('Failed to update product. Please try again.');
            }
          });
        },
        onError: (error) => {
          console.error('Error uploading images:', error);
          toast.error('Failed to upload images. Please try again.');
        }
      });
    } else {
      // No images to upload, just update product directly
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        quantity_left: Number.parseFloat(formData.quantity_left),
        images: formData.images.map(img => img.name),
        rating: product?.rating || 0,
      };

      updateProductMutation.mutate({ id, data: productData }, {
        onSuccess: () => {
          toast.success('Product updated successfully!');
          navigate(`/products/detail/${id}`);
        },
        onError: (error) => {
          console.error('Error updating product:', error);
          toast.error('Failed to update product. Please try again.');
        }
      });
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const getCategoryOptions = () => {
    if (!formData.fit_position) return [];
    switch (formData.fit_position) {
      case 'other': return itemsOther.map(item => ({ value: item.text, label: item.text }));
      case 'interior': return itemsInterior.map(item => ({ value: item.text, label: item.text }));
      case 'exterior': return itemsExterior.map(item => ({ value: item.text, label: item.text }));
      case 'body kit': return itemsBodykits.map(item => ({ value: item.text, label: item.text }));
      case 'lighting': return itemsLighting.map(item => ({ value: item.text, label: item.text }));
      default: return [];
    }
  };

  const getSubcategoryOptions = () => {
    if (formData.category === 'Exhaust') return ExhaustSubCategory;
    if (formData.category === 'Suspension Parts') return SuspensionPartsSubCategory;
    return [];
  };

  const getPerformanceSubcategoryOptions = () => {
    return performanceSubcategories[formData.category] || [];
  };

  const getPerformanceFinalCategoryOptions = () => {
    return performanceFinalCategories[formData.subcategory] || [];
  };

  const getFilteredCarModels = () => {
    return carModels.filter(carModel => {
      if (formData.car_brand === 'Toyota Corolla') return carModel.label.includes('Corolla');
      if (formData.car_brand === 'Toyota Camry') return carModel.label.includes('Camry');
      if (formData.car_brand === 'Toyota GR86') return carModel.label.includes('GR86');
      if (formData.car_brand === 'Toyota Supra') return carModel.label.includes('SUPRA');
      return true;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Error loading product. Please try again.</p>
          <button
            onClick={() => navigate('/products/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Product not found</p>
          <button
            onClick={() => navigate('/products/list')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/products/detail/${id}`)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md"
                  aria-label="Back to product detail"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                  <p className="mt-1 text-sm text-gray-600">Update the product details below</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Performance Part</span>
                    <button
                      type="button"
                      onClick={() => handleInputChange('performance_part', !formData.performance_part)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        formData.performance_part ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                      aria-pressed={formData.performance_part}
                      aria-label="Toggle Performance Part"
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          formData.performance_part ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <ImageUpload
                  label="Product Images"
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                  required
                  error={errors.images}
                />

                <FormInput
                  label="Product Name"
                  value={formData.product_name}
                  onChange={(e) => handleInputChange('product_name', e.target.value)}
                  placeholder="Enter product name"
                  required
                  error={errors.product_name}
                />

                <FormInput
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                  error={errors.price}
                />

                <FormInput
                  label="Quantity Available"
                  type="number"
                  value={formData.quantity_left}
                  onChange={(e) => handleInputChange('quantity_left', e.target.value)}
                  placeholder="0"
                  required
                  error={errors.quantity_left}
                />

                <FormRadioGroup
                  label="Car Brand"
                  value={formData.car_brand}
                  onChange={(e) => handleInputChange('car_brand', e.target.value)}
                  options={[
                    { value: 'Toyota Corolla', label: 'Toyota Corolla' },
                    { value: 'Toyota Camry', label: 'Toyota Camry' },
                    { value: 'Toyota GR86', label: 'Toyota GR86' },
                    { value: 'Toyota Supra', label: 'Toyota Supra' }
                  ]}
                  required
                  error={errors.car_brand}
                />

                <FormRadioGroup
                  label="Car Model"
                  value={formData.car_model}
                  onChange={(e) => handleInputChange('car_model', e.target.value)}
                  options={getFilteredCarModels()}
                  required
                  error={errors.car_model}
                />

                <FormRadioGroup
                  label="Hot Product"
                  value={formData.hot_product}
                  onChange={(e) => handleInputChange('hot_product', e.target.value === 'true')}
                  options={[
                    { value: true, label: 'Yes' },
                    { value: false, label: 'No' }
                  ]}
                />

                <FormRadioGroup
                  label="Make Material"
                  value={formData.make_material}
                  onChange={(e) => handleInputChange('make_material', e.target.value)}
                  options={[
                    { value: 'carbon fiber', label: 'Carbon Fiber' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {!formData.performance_part && (
                  <FormRadioGroup
                    label="Category Type"
                    value={formData.fit_position}
                    onChange={(e) => handleInputChange('fit_position', e.target.value)}
                    options={categories}
                    required
                    error={errors.fit_position}
                  />
                )}

                {!formData.performance_part && formData.fit_position && (
                  <FormRadioGroup
                    label="Category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    options={getCategoryOptions()}
                    required
                    error={errors.category}
                  />
                )}

                {!formData.performance_part && formData.category && (
                  <FormRadioGroup
                    label="Sub-Category"
                    value={formData.subcategory}
                    onChange={(e) => handleInputChange('subcategory', e.target.value)}
                    options={getSubcategoryOptions()}
                  />
                )}

                {formData.performance_part && (
                  <>
                    <FormRadioGroup
                      label="Performance Category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      options={performanceCategories}
                      required
                      error={errors.category}
                    />

                    {formData.category && (
                      <FormRadioGroup
                        label="Performance Subcategory"
                        value={formData.subcategory}
                        onChange={(e) => handleInputChange('subcategory', e.target.value)}
                        options={getPerformanceSubcategoryOptions()}
                      />
                    )}

                    {formData.subcategory && (
                      <FormRadioGroup
                        label="Performance Final Category"
                        value={formData.final_subcategory}
                        onChange={(e) => handleInputChange('final_subcategory', e.target.value)}
                        options={getPerformanceFinalCategoryOptions()}
                      />
                    )}
                  </>
                )}

                {formData.category === 'Wheel' && !formData.performance_part && (
                  <>
                    <FormRadioGroup
                      label="Category Brand"
                      value={formData.category_brand}
                      onChange={(e) => handleInputChange('category_brand', e.target.value)}
                      options={[
                        { value: 'Kansei', label: 'Kansei' },
                        { value: 'Enkei', label: 'Enkei' },
                        { value: 'Advan Racing', label: 'Advan Racing' },
                        { value: 'Bc Forged', label: 'Bc Forged' },
                        { value: 'Volk Racing', label: 'Volk Racing' },
                        { value: 'FR1', label: 'FR1' }
                      ]}
                    />

                    <FormInput
                      label="Wheel Size"
                      value={formData.wheel_size}
                      onChange={(e) => handleInputChange('wheel_size', e.target.value)}
                      placeholder="e.g., 18x8.5"
                    />
                  </>
                )}

                {formData.category === 'Exhaust' && (
                  <FormInput
                    label="YouTube Video ID"
                    value={formData.video}
                    onChange={(e) => handleInputChange('video', e.target.value)}
                    placeholder="Enter YouTube video ID"
                  />
                )}

                <FormTextEditor
                  label="Description"
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder="Enter product description..."
                />

                <FormTextEditor
                  label="Features"
                  value={formData.features}
                  onChange={(value) => handleInputChange('features', value)}
                  placeholder="Enter product features..."
                />

                <FormTextEditor
                  label="Fitment"
                  value={formData.fitment}
                  onChange={(value) => handleInputChange('fitment', value)}
                  placeholder="Enter fitment information..."
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
                disabled={updateProductMutation.isPending}
                className="px-6 py-2 text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProductMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Updating Product...
                  </>
                ) : (
                  'Update Product'
                )}
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
          isLoading={updateProductMutation.isPending}
        />
      )}
    </div>
  );
};

export default EditProductPage;