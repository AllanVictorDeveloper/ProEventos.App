
import { AbstractControl, FormGroup } from "@angular/forms";

export class ValidatorField {
  static MustMath(controlName: string, mathingControlName: string): any {
    return (group: AbstractControl) => {
      const formGroup =  group as FormGroup;
      const control =  formGroup.controls[controlName];
      const matchingControl =  formGroup.controls[mathingControlName];

      if(matchingControl.errors && !matchingControl.errors["mustMach"]){
        return null;
      }

      if(control.value !== matchingControl.value){
        matchingControl.setErrors({mustMatch: true})
      } else {
        matchingControl.setErrors(null);
      }

      return null;
    }
  }
}
