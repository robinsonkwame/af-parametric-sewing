export function findClosestSize(new_measurement_size, gender, the_measurement_name, getMeasurementFunc) {

    let left = 0;
    let right = 600//sizes.length - 1;
    let closestIndex = 340; // closest mm neckSize
      let the_mid_size; // of the body part (not the neck, typ)
  
    while (left <= right) {
      const neckSize = Math.floor((left + right) / 2);
  
          if(!neckSize){
              break
          }
          
          //console.log('neckSize', neckSize, ' body part is ', the_mid_size)
          let the_new_sizes = getMeasurementFunc({
              neckSize: neckSize, 
              gender: gender
          })
          the_mid_size = the_new_sizes.size[the_measurement_name] // of the body part (not the neck, typ)
          
      if (the_mid_size === new_measurement_size) {
        closestIndex = neckSize;
        break;
      }
  
      if (Math.abs(the_mid_size - new_measurement_size) < Math.abs(closestIndex - new_measurement_size)) {
        closestIndex = neckSize; // pick the neckSize of the closer option, which is the_mid_size here
      }
  
      if (the_mid_size < new_measurement_size) {
        left = neckSize + 1;
      } else {
        right = neckSize - 1;
      }
    }
  
      const within_tol = Math.abs(new_measurement_size - the_mid_size) < 10 // w/in 10 mm
      const reason = new_measurement_size - the_mid_size > 0 ? "too big!" : "too small!"
      
    return within_tol ? {neckSize: closestIndex} : {neckSize: false, reason: reason};
  }