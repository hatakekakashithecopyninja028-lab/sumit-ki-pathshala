// controllers/adminProduct.controller.js
import courseschema from "../modals/enrollecourse.modal.js"

// ➕ ADD PRODUCT
export const addProduct = async (req, res) => {
  try {
    const product = await courseschema.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📦 GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await courseschema.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📄 GET SINGLE COURSE
export const getCourseById = async (req, res) => {
  try {
    const course = await courseschema.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await courseschema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await courseschema.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

