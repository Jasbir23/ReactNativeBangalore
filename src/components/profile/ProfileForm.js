import { observable, computed } from "mobx";
import validate from "mobx-form-validate";

export default class ProfileForm {
  @observable
  @validate(/^[A-Za-z]+[ ]{1}[A-Za-z]+$/, "Name must have first and last")
  name = "";

  @observable
  @validate(
    /^[A-Za-z0-9]+[@]{1}[A-Za-z0-9]+[.]{1}[A-Za-z0-9.]+$/,
    "Please enter a valid email"
  )
  email = "";

  @observable
  @validate(/^[A-Za-z()]*$/, "Profession must be a word")
  profession = "";

  @observable
  @validate(/^[0-9.]*$/, "Experience must be a number")
  experience = "";

  @observable
  @validate(/^[A-Za-z]*$/, "City must be a string")
  city = "";
}
const form = new ProfileForm();
