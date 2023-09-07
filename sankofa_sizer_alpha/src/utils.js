import { onMount } from 'svelte';
import { writable } from 'svelte/store';

export const actual_pattern = writable(
	{
		'blob': null,
		'width': null,
		'height': null
	}
);

export const the_id_of_the_base_pattern = "base_pattern"
export const the_id_of_the_virtual_pattern = "virtual-pattern"

export const show_popup_pattern = writable(false);
export const pixels_per_inch = writable(12); // this is PPI for VirtualResize, on screen 
export const toggle_overlay = writable(null);
export const box_to_checkbox = writable(
	{
		'bodyPart': null,
		'toggle': false // todo: i just flip this back and forth to force an update, better to do it the right way
	}
);
export const add_image_toggle = writable(false);

/* parts are filled in from the BodyPart widget */
export const parts = writable([
  { 
		name: 'Shoulder to wrist (arm)',
		id: 1,
		 x: 0, 
		 y: 0, 
		 lineX: 0,
		 lineY: 0,
		 virtual_length: 21, // inches
		 actual_length: 21,
		selected: false,
		type: 'vertical'
	},{ 
		name: 'Biceps',
		id: 2,
		x: 0,
		y: 0,
 	  lineX: 0,
		lineY: 0,
		virtual_length: 16, // inches
		actual_length: 16,
		selected: false, 
		type: 'horizontal'
	},{
		name: 'Wrist width',
		id: 3,
		x: 0, 
		y: 0, 
  	lineX: 0,
	  lineY: 0,
	  virtual_length: 8, // inches
		 actual_length: 8,		
		selected: false, 
		type: 'horizontal'
	}		
]);


/*
export const parts = writable([
  { 
		name: 'Shoulder to wrist (arm)',
		id: 1,
		 x: 60, 
		 y: 15, 
		 lineX: 60,
		 lineY: 15,
		 length: 320, // inches
		selected: true,
		type: 'vertical'
	},{ 
		name: 'Wrist width',
		id: 2,
		x: 70, 
		y: 40, 
  	lineX: 70,
	  lineY: 45,
	  length: 120, // inches
		selected: true, 
		type: 'horizontal'
	},{ 
		name: 'Biceps',
		id: 3,
		x: 55,
		y: 25,
 	  lineX: 55,
		lineY: 25,
		length: 150, // inches
		selected: false, 
		type: 'horizontal'
	},
]);
*/

export function updateParts(lengthUpdates) {
  parts.update(($parts) => {
    // Iterate over the lengthUpdates array and update the corresponding $parts
    for (let i = 0; i < lengthUpdates.length; i++) {
      $parts[i].virtual_length = lengthUpdates[i]['length'];
      $parts[i].actual_length = lengthUpdates[i]['length'];
    }
    return $parts; // Return the updated $parts array
  });
}

export function addModifiedParts(lengthUpdates) {
  parts.update(($parts) => {
    // Here we're copying and modifying the parts
    // We use the lengthUpdates array to set the new length of each part
    // and append ' (new)' to the name
    const modifiedParts = $parts.map((part, index) => ({
      ...part,
      name: `${part.name} (new)`,
      length: lengthUpdates[index].length,
    }));

    // Finally, add the modified parts to the store array by concatenating it with the original parts
    return [...$parts, ...modifiedParts];
  });
}

// UNITS OF CENTIMETER

// NOTE:THIS IS FOR MALES
const bartol_meas_coefs = [
	[-0.00843030307, 0.00131652804, 0.447547912],
	[-0.120123132, 0.00236365418, 0.434361632],
	[0.193903283, 0.00139706978, 0.219167417],
	[-0.397436516, 0.00736043837, 1.09456939],
	[-0.287314058, 0.00742628431, 0.850773834],
	[0.010597377, 0.00414945566, 0.671920092],
	[0.0118373525, 0.000588985393, 0.103642264],
	[-0.137002408, 0.00245121599, 0.355032717],
	[-0.0214599125, 0.00124200087, 0.218721466],
	[0.336286377, -0.0000717186131, -0.063483009],
	[0.612709628, -0.000969801753, -0.254300726],
	[-0.0583795701, 0.00283900146, 0.474284018],
	[-0.0407932606, 0.00160870682, 0.30903314],
	[0.00520639762, 0.000828895423, 0.149071685],
	[-0.02324052, 0.00121216556, 0.313450831],
];

  const bartol_labels = [
    'head_circumference',
    'neck_circumference',
    'shoulder_to_crotch',
    'chest_circumference',
    'waist_circumference',
    'pelvis_circumference',
    'wrist_circumference',
    'bicep_circumference',
    'forearm_circumference',
    'arm_length',
    'inside_leg_length',
    'thigh_circumference',
    'calf_circumference',
    'ankle_circumference',
    'shoulder_breadth',
  ];


function bodyPartEstimations(heightInMeters, weightInKg) {
  const measurements = meas_coefs.map((coef) => {
    return heightInMeters * coef[0] + weightInKg * coef[1] + coef[2];
  });

  let output = '';

  for (let i = 0; i < labels.length; i++) {
    output += `${labels[i]}: ${(measurements[i] * 100).toFixed(2)}cm\n`;
  }

  return output;
}

export const bartol_et_al_measurements = (heightInMeters, weightInKg) => {
  const measurements = bartol_meas_coefs.map((coef) => {
    return heightInMeters * coef[0] + weightInKg * coef[1] + coef[2];
  });

	let estimations = {}
  for (let i = 0; i < bartol_labels.length; i++) {
    estimations[bartol_labels[i]] = measurements[i] * 100;
  }

  estimations['height'] = heightInMeters * 100;
  estimations['weight'] = weightInKg;

  return estimations;
}

export const bartol_to_part = {
	'Shoulder to wrist (arm)': (meas, heightInMeters) => {return meas['arm_length']}, // does that include the hand?
	'biceps': (meas, heightInMeters) => {return meas['bicep_circumference']},
	'Wrist width': (meas, heightInMeters) => {return meas['wrist_circumference']},
}

const shoulder_to_wrist = "shoulder_to_wrist"
const bicep = "bicep"
const wrist = "wrist"

export const checkboxStates = [
	shoulder_to_wrist,  // note to self, should really be using const varibale names; tracking this bug cost me 2 h :_(
	bicep,
	wrist,
	"ankle",
	"inseam",
	"knee",
	"seatback"
]

// TODO: finish after demo given
export const checkBoxToPartId = {
	shoulder_to_wrist: 1,
	bicep: 2,
	wrist: 3,
}