import Remark from '../models/Remark.js';

export const getRemarksByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const remarks = await Remark.findAll({
      where: { profileId },
      order: [['date', 'DESC']]
    });
    res.json(remarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRemark = async (req, res) => {
  try {
    const { profileId, type, madeBy, title, body } = req.body;
    const remark = await Remark.create({
      profileId,
      type,
      madeBy,
      title,
      body
    });
    res.status(201).json(remark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, madeBy, title, body } = req.body;
    const remark = await Remark.findByPk(id);
    
    if (!remark) {
      return res.status(404).json({ error: 'Remark not found' });
    }
    
    await remark.update({
      type,
      madeBy,
      title,
      body
    });
    
    res.json(remark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRemark = async (req, res) => {
  try {
    const { id } = req.params;
    const remark = await Remark.findByPk(id);
    
    if (!remark) {
      return res.status(404).json({ error: 'Remark not found' });
    }
    
    await remark.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
