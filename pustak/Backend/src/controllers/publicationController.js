const publicationService = require('../services/publicationService');

const getPublications = async (req, res) => {
  try {
    const publications = await publicationService.getAllPublications();
    res.status(200).json({ success: true, data: publications });
  } catch (error) {
    console.error('Error fetching publications:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const publication = await publicationService.getPublicationByID(id);

    if (!publication) {
      return res.status(404).json({ success: false, message: 'Publication not found' });
    }

    return res.status(200).json({ success: true, data: publication });
  } catch (error) {
    console.error('Error fetching publication:', error.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getPublications,
  getPublication,
};
