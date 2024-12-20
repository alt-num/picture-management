import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Profile from './Profile.js';

const Remark = sequelize.define('Remark', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  profileId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Profile,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('suggestion', 'complaint', 'request'),
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  madeBy: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

// Set up the relationship between Profile and Remark
Profile.hasMany(Remark, {
  foreignKey: 'profileId',
  as: 'remarks'
});
Remark.belongsTo(Profile, {
  foreignKey: 'profileId'
});

export default Remark;
