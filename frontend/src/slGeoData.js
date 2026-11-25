const zone = (name, district) => ({ name, district });

export const SL_GEO_DATA = [
  {
    name: 'Western',
    districts: [
      { name: 'Colombo', zones: [zone('Colombo Central', 'Colombo'), zone('Colombo North', 'Colombo'), zone('Colombo South', 'Colombo'), zone('Sri Jayawardenepura', 'Colombo'), zone('Homagama', 'Colombo'), zone('Moratuwa', 'Colombo')] },
      { name: 'Gampaha', zones: [zone('Gampaha', 'Gampaha'), zone('Negombo', 'Gampaha'), zone('Kelaniya', 'Gampaha'), zone('Minuwangoda', 'Gampaha'), zone('Gampaha East', 'Gampaha')] },
      { name: 'Kalutara', zones: [zone('Kalutara', 'Kalutara'), zone('Horana', 'Kalutara'), zone('Matugama', 'Kalutara'), zone('Panadura', 'Kalutara'), zone('Beruwala', 'Kalutara')] }
    ]
  },
  {
    name: 'Central',
    districts: [
      { name: 'Kandy', zones: [zone('Kandy', 'Kandy'), zone('Teldeniya', 'Kandy'), zone('Wattegama', 'Kandy'), zone('Gampola', 'Kandy'), zone('Galagedara', 'Kandy')] },
      { name: 'Matale', zones: [zone('Matale', 'Matale'), zone('Galewela', 'Matale'), zone('Rattota', 'Matale'), zone('Dambulla', 'Matale')] },
      { name: 'Nuwara Eliya', zones: [zone('Nuwara Eliya', 'Nuwara Eliya'), zone('Hatton', 'Nuwara Eliya'), zone('Walapane', 'Nuwara Eliya')] }
    ]
  },
  {
    name: 'Southern',
    districts: [
      { name: 'Galle', zones: [zone('Galle', 'Galle'), zone('Elpitiya', 'Galle'), zone('Udugama', 'Galle'), zone('Ambalangoda', 'Galle'), zone('Habaraduwa', 'Galle')] },
      { name: 'Matara', zones: [zone('Matara', 'Matara'), zone('Akuressa', 'Matara'), zone('Weligama', 'Matara'), zone('Deniyaya', 'Matara')] },
      { name: 'Hambantota', zones: [zone('Hambantota', 'Hambantota'), zone('Tangalle', 'Hambantota'), zone('Beliatta', 'Hambantota'), zone('Katuwana', 'Hambantota')] }
    ]
  },
  {
    name: 'Northern',
    districts: [
      { name: 'Jaffna', zones: [zone('Jaffna', 'Jaffna'), zone('Chavakachcheri', 'Jaffna'), zone('Vadamarachchi', 'Jaffna'), zone('Thenmarachchi', 'Jaffna'), zone('Nallur', 'Jaffna')] },
      { name: 'Kilinochchi', zones: [zone('Kilinochchi', 'Kilinochchi'), zone('Pachchilaipalli', 'Kilinochchi'), zone('Poonakary', 'Kilinochchi')] },
      { name: 'Mannar', zones: [zone('Mannar', 'Mannar'), zone('Madhu', 'Mannar'), zone('Nanaddan', 'Mannar')] },
      { name: 'Mullaitivu', zones: [zone('Mullaitivu', 'Mullaitivu'), zone('Puthukkudiyiruppu', 'Mullaitivu'), zone('Mankulam', 'Mullaitivu')] },
      { name: 'Vavuniya', zones: [zone('Vavuniya', 'Vavuniya'), zone('Vavuniya South', 'Vavuniya'), zone('Vengalacheddikulam', 'Vavuniya')] }
    ]
  },
  {
    name: 'Eastern',
    districts: [
      { name: 'Batticaloa', zones: [zone('Batticaloa', 'Batticaloa'), zone('Kalkudah', 'Batticaloa'), zone('Paddiruppu', 'Batticaloa'), zone('Pattipola', 'Batticaloa')] },
      { name: 'Ampara', zones: [zone('Ampara', 'Ampara'), zone('Kalmunai', 'Ampara'), zone('Akkaraipattu', 'Ampara'), zone('Dehiattakandiya', 'Ampara')] },
      { name: 'Trincomalee', zones: [zone('Trincomalee', 'Trincomalee'), zone('Kinniya', 'Trincomalee'), zone('Mutur', 'Trincomalee')] }
    ]
  },
  {
    name: 'North Western',
    districts: [
      { name: 'Kurunegala', zones: [zone('Kurunegala', 'Kurunegala'), zone('Kuliyapitiya', 'Kurunegala'), zone('Nikaweratiya', 'Kurunegala'), zone('Mawathagama', 'Kurunegala'), zone('Wariyapola', 'Kurunegala')] },
      { name: 'Puttalam', zones: [zone('Puttalam', 'Puttalam'), zone('Chilaw', 'Puttalam'), zone('Anamaduwa', 'Puttalam'), zone('Wennappuwa', 'Puttalam')] }
    ]
  },
  {
    name: 'North Central',
    districts: [
      { name: 'Anuradhapura', zones: [zone('Anuradhapura', 'Anuradhapura'), zone('Kekirawa', 'Anuradhapura'), zone('Medawachchiya', 'Anuradhapura'), zone('Galenbindunuwewa', 'Anuradhapura')] },
      { name: 'Polonnaruwa', zones: [zone('Polonnaruwa', 'Polonnaruwa'), zone('Hingurakgoda', 'Polonnaruwa'), zone('Medirigiriya', 'Polonnaruwa')] }
    ]
  },
  {
    name: 'Uva',
    districts: [
      { name: 'Badulla', zones: [zone('Badulla', 'Badulla'), zone('Bandarawela', 'Badulla'), zone('Mahiyanganaya', 'Badulla'), zone('Welimada', 'Badulla')] },
      { name: 'Monaragala', zones: [zone('Monaragala', 'Monaragala'), zone('Bibile', 'Monaragala'), zone('Wellawaya', 'Monaragala')] }
    ]
  },
  {
    name: 'Sabaragamuwa',
    districts: [
      { name: 'Ratnapura', zones: [zone('Ratnapura', 'Ratnapura'), zone('Balangoda', 'Ratnapura'), zone('Embilipitiya', 'Ratnapura'), zone('Pelmadulla', 'Ratnapura')] },
      { name: 'Kegalle', zones: [zone('Kegalle', 'Kegalle'), zone('Mawanella', 'Kegalle'), zone('Rambukkana', 'Kegalle'), zone('Dehiowita', 'Kegalle')] }
    ]
  }
];

export const GEO_SCHOOLS = [
  { id: 'SCH-101', name: 'Royal College, Colombo 07', province: 'Western', district: 'Colombo', zone: 'Colombo Central' },
  { id: 'SCH-102', name: 'Padukka Siri Piyarathana Vidyalaya', province: 'Western', district: 'Colombo', zone: 'Homagama' },
  { id: 'SCH-103', name: 'Dharmaraja College, Kandy', province: 'Central', district: 'Kandy', zone: 'Kandy' },
  { id: 'SCH-104', name: 'Hasalaka Gamini Maha Vidyalaya', province: 'Central', district: 'Kandy', zone: 'Teldeniya' },
  { id: 'SCH-105', name: 'Richmond College, Galle', province: 'Southern', district: 'Galle', zone: 'Galle' }
];

export const PROVINCES = SL_GEO_DATA.map((province) => province.name);

export function getDistricts(provinceName) {
  return SL_GEO_DATA.find((province) => province.name === provinceName)?.districts || [];
}

export function getZones(provinceName, districtName) {
  return getDistricts(provinceName).find((district) => district.name === districtName)?.zones || [];
}

export function getSchools(provinceName, districtName, zoneName) {
  return GEO_SCHOOLS.filter(
    (school) =>
      school.province === provinceName &&
      school.district === districtName &&
      school.zone === zoneName
  );
}
