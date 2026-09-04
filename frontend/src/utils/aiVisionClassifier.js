import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let cachedModel = null;

const NON_CIVIC_KEYWORDS = [
  // Footwear & Clothing
  'shoe', 'running shoe', 'sneaker', 'sandal', 'clog', 'sock', 'boot', 'cowboy boot', 'loafer', 'high heel', 'footwear',
  'jean', 'pant', 'shirt', 't-shirt', 'jersey', 'jacket', 'coat', 'suit', 'groom', 'dress', 'skirt', 'sweater', 'sweatshirt',
  'hoodie', 'bikini', 'pajama', 'apron', 'glove', 'mitten', 'hat', 'cap', 'bonnet', 'helmet', 'tie', 'scarf', 'belt', 'buckle',
  'watch', 'wrist watch', 'digital watch', 'stopwatch', 'backpack', 'handbag', 'purse', 'wallet', 'umbrella', 'sunglasses', 'sunglass', 'wig',

  // Vehicles & Transportation
  'car', 'sports car', 'convertible', 'minivan', 'limousine', 'cab', 'taxi', 'jeep', 'pickup', 'grille', 'radiator grille',
  'wheel', 'tire', 'motorcycle', 'moped', 'scooter', 'bicycle', 'bus', 'minibus', 'trolleybus', 'trailer truck', 'fire engine', 'ambulance',

  // People, Animals & Pets
  'person', 'man', 'woman', 'face', 'selfie',
  'dog', 'golden retriever', 'terrier', 'pug', 'chihuahua', 'cat', 'tabby', 'persian cat', 'horse', 'cow', 'sheep', 'goat', 'pig', 'bird',

  // Furniture & Home Interior
  'chair', 'folding chair', 'desk', 'couch', 'sofa', 'studio couch', 'bed', 'wardrobe', 'dining table', 'bookcase', 'pillow', 'quilt', 'cushion',
  'curtain', 'rug', 'carpet', 'mirror', 'vase', 'clock', 'wall clock', 'picture frame',

  // Electronics, Cables & Gadgets
  'laptop', 'notebook', 'cellular telephone', 'cellphone', 'mobile phone', 'television', 'screen', 'monitor', 'computer keyboard', 'mouse',
  'ipod', 'remote control', 'camera', 'radio', 'speaker', 'headphones', 'earphones', 'microwave', 'refrigerator', 'toaster', 'iron', 'vacuum',
  'cord', 'cable', 'wire', 'plug', 'charger', 'usb', 'power cord', 'switch', 'lanyard', 'strap', 'ribbon', 'necklace', 'id card', 'badge', 'card',

  // Food, Drinks & Kitchenware
  'coffee mug', 'cup', 'mug', 'plate', 'bowl', 'water bottle', 'wine bottle', 'beer bottle', 'pizza', 'sandwich', 'hotdog', 'hamburger', 'burger', 'cake',

  // Miscellaneous Consumer Goods
  'envelope', 'book jacket', 'book', 'comic book', 'packet', 'menu', 'teddy bear', 'toy', 'balloon', 'dumbbell', 'ball', 'paper', 'document'
];

const CIVIC_DEFECT_KEYWORDS = [
  'ashcan', 'trash can', 'garbage can', 'wastebin', 'dustbin', 'refuse bin',
  'pothole', 'street sign', 'drain', 'sewer', 'gutter', 'street light', 'lamp post', 'manhole',
  'debris', 'rubble', 'construction', 'brick', 'tile', 'paver', 'paving', 'stone', 'sand', 'gravel',
  'curb', 'sidewalk', 'footpath', 'street', 'road', 'dirt', 'earth', 'ground', 'concrete', 'asphalt', 'wall'
];

/**
 * High-Speed On-Device Visual Object Recognition
 * Uses TensorFlow MobileNet Neural Network (100% Free & Offline)
 */
export async function auditImageWithMobileNet(base64Image) {
  try {
    if (!cachedModel) {
      cachedModel = await mobilenet.load({ version: 2, alpha: 1.0 });
    }

    const img = new Image();
    img.src = base64Image;
    await img.decode();

    const predictions = await cachedModel.classify(img, 3);
    if (!predictions || predictions.length === 0) {
      return { isCivicDefect: true, label: 'Unclassified capture' };
    }

    // Check top predictions for any non-civic item
    for (const pred of predictions) {
      const predName = pred.className.toLowerCase();
      const predProb = pred.probability;

      const isNonCivic = NON_CIVIC_KEYWORDS.some(kw => predName.includes(kw));
      const isCivic = CIVIC_DEFECT_KEYWORDS.some(kw => predName.includes(kw));

      // Only reject if it's strongly a non-civic private item (> 40% confidence) and not an outdoor/civic scene
      if (isNonCivic && !isCivic && predProb > 0.40) {
        let cleanName = pred.className.split(',')[0].trim();
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        return {
          isCivicDefect: false,
          detectedObject: cleanName,
          confidence: Math.round(predProb * 100),
          reason: `Strict AI Mode Rejection: Detected "${cleanName}" (${Math.round(predProb * 100)}% confidence). This is a private item/personal object, not a municipal civic defect (garbage, pothole, water leak, broken streetlight).`
        };
      }
    }

    const topMatch = predictions[0];
    return {
      isCivicDefect: true,
      detectedObject: topMatch.className.split(',')[0].trim(),
      confidence: Math.round(topMatch.probability * 100)
    };
  } catch (error) {
    console.warn('MobileNet on-device audit note:', error);
    return { isCivicDefect: true, label: 'On-site capture' };
  }
}
