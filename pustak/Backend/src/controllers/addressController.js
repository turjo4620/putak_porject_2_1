const addressService = require('../services/addressService');

async function getAddresses(req, res, next) {
  try {
    const addresses = await addressService.getUserAddresses(req.userId);
    res.json(addresses);
  } catch (err) { next(err); }
}

async function createAddress(req, res, next) {
  try {
    const address = await addressService.createAddress(req.userId, req.body);
    res.status(201).json(address);
  } catch (err) { next(err); }
}

async function setDefault(req, res, next) {
  try {
    const address = await addressService.setDefaultAddress(req.userId, req.params.id);
    res.json(address);
  } catch (err) { next(err); }
}

async function deleteAddress(req, res, next) {
  try {
    await addressService.deleteAddress(req.userId, req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
}

module.exports = { getAddresses, createAddress, setDefault, deleteAddress };
