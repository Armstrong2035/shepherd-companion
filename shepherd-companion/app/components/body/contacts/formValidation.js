// components/contacts/FormValidation.js
export const validateContact = (formData) => {
  const errors = {};

  // Validate required fields
  if (!formData.name.trim()) {
    errors.name = "Name is required";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone number is required";
  } else {
    // Validate phone format (simple validation)
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      errors.phone = "Please enter a valid phone number";
    }
  }

  // If not WhatsApp but WhatsApp number provided, validate it
  if (!formData.isWhatsApp && formData.whatsAppNumber) {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(formData.whatsAppNumber.replace(/\s+/g, ""))) {
      errors.whatsAppNumber = "Please enter a valid WhatsApp number";
    }
  }

  // Validate email if provided
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
