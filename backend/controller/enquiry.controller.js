import Enquiry from "../modals/enquiry.js"

export const enquiryfield = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const { name, parent_name, studentClass, phone, email, course, message } = req.body;

    const enquiry = new Enquiry({
      name,
      parent_name,
      studentClass,
      phone,
      email,
      course,
      message,
    });

    const savedData = await enquiry.save();
    console.log("SAVED DATA:", savedData);

    res.status(201).json({
      message: "Enquiry saved successfully 🎉",
    });
  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({
      message: "Save failed",
    });
  }
}

// Get all enquiries (admin only)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      enquiries
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

// Delete enquiry (admin only)
export const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({
        message: "Enquiry not found"
      });
    }
    res.status(200).json({
      message: "Enquiry deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}

