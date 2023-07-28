import { getMeasurements, CISFEMALE, CISMALE } from './freesewingMeasurement.js'
import { writable } from 'svelte/store';

// Add base measurement URL for dynamic creation of URLs per measurement
let baseMeasurementURL = "https://freesewing.org/docs/measurements/";
let baseGender = CISFEMALE;

const MM_TO_INCH = 25.4;

// Grow End
const from_the_bottom = "from_the_bottom";
const from_the_top = "from_the_top";
const from_the_left = "from_the_left";
const from_the_right = "from_the_right";
const from_both_sides = "from_both_sides";

// Orientation
const vertical = "vertical"
const horizontal = "horizontal"
const at_an_angle = "at_an_angle"

// Base orientation object
// Orientation with grow end Object
export const horz_both = {orientation: horizontal, grow_end: from_both_sides}
export const vert_from_top = {orientation: vertical, grow_end: from_the_top}
export const vert_from_bottom = {orientation: vertical, grow_end: from_the_bottom}
export const horz_from_right = {orientation: horizontal, grow_end: from_the_right}

export const are_equal = (obj1, obj2) => {return obj1.key1 === obj2.key1 && obj1.key2 === obj2.key2}

// note, depending on front or side, a measurement might have different orientations,
// for example, the bust. That said, I'm not sure this is a problem that should
// be tackled right now
const baseOrientationGrowEnd = {
  // Arc measurements
  bustFront: horz_both,
  bustBack: horz_both, // not found on fs.org/docs/measurements/... ?
  bustPointToUnderbust: vert_from_top,
  bustSpan: horz_both,
  highBustBack: horz_both,
  highBustFront: horz_both,
  // Circumference measurements
  ankle: horz_both,
  biceps: horz_both,
  chest: horz_both,
  highBust: horz_both,
  hips: horz_both,
  neck: horz_both,
  underbust: horz_both,
  // Vertical measurements
  crotchDepth: vert_from_top,
  hpsToBust: vert_from_bottom,
  hpsToWaistBack: vert_from_bottom,
  hpsToWaistFront: vert_from_bottom,
  waistToArmhole: vert_from_top,
  waistToHips: vert_from_top,
  waistToKnee: vert_from_bottom,
  waistToSeat: vert_from_top,
  waistToUnderbust: vert_from_top,
  waistToUpperLeg: vert_from_bottom,
  // Other
  crossSeam: vert_from_top,
  crossSeamFront: vert_from_top,
  crossSeamBack: vert_from_top,
  head: horz_both,
  heel: horz_both,
  inseam: vert_from_bottom,
  knee: horz_both,
  seat: horz_both,
  seatBack: horz_both,
  seatBackArc: horz_both,
  seatFront: horz_both,
  seatFrontArc: horz_both,
  shoulderToElbow: vert_from_bottom,
  shoulderToShoulder: horz_both,
  shoulderToWrist: vert_from_bottom,
  upperLeg: horz_both,
  waist: horz_both,
  waistBack: horz_both,
  waistBackArc: horz_both, // this more like top down view
  waistFrontArc: horz_both,
	waistFront: horz_both,
  waistToFloor: vert_from_bottom,
  wrist: horz_both,
}

export let bodyMeasurements = writable({
    size: {}, // Stores values by neck size
		orientation_grow_end: JSON.parse(JSON.stringify(baseOrientationGrowEnd)),
    gender: baseGender,
    ratio_corrections: {
        circumference: 1,
        arc: 0.5,
        linear: 0.65,
        vertical: 0.65,
        degrees: 1,
        custom: {}, // Provided on a per size basis
    },
		grow_end: {},
    urls: {}, // Will contain URLs per measurement, dynamically created
    printedNames: {}, // Will contain printed names per measurement
})

// util method to pass along to .set
bodyMeasurements.getMeasurements = ({neckSize, gender}) => {
		let size = getMeasurements(neckSize, gender)
		let url = {}
		let printedNames = {}

		for (const key in size) {
			url[key] = `${baseMeasurementURL}${key}/`.toLowerCase(); // update urls
			//printedNames[key] = key.replace(/([A-Z])/g, ' $1').trim(); // update printedNames
			let use_this_key = key.replace(/^\w/, function(match){
				  return match.toUpperCase();
				}).replace(/([A-Z])/g, function(match, p1) {
				  return ' ' + p1.toUpperCase();
				}).trim(); // why is this so ugly javascript
			printedNames[key] = use_this_key
		}
	
		return {
	    size: size, // Stores values by neck size
			orientation_grow_end: JSON.parse(JSON.stringify(baseOrientationGrowEnd)),
	    gender: gender,
	    ratio_corrections: {
	        circumference: 1,
	        arc: 0.5,
	        linear: 0.65,
	        vertical: 0.65,
	        degrees: 1,
	        custom: {}, // Provided on a per size basis
	    },
	    urls: url, // Will contain URLs per measurement, dynamically created
	    printedNames: printedNames, // Will contain printed names per measurement
		}
}