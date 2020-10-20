import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
   countries: Country[] = [];
  constructor(private formBuilder: FormBuilder, private luv2shopService: Luv2ShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
         firstName: [''],
         lastName: [''],
         email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode:['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth:[''],
        expirationYear:['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode:['']
      })
    });
    const startMonth: number = new Date().getMonth() + 1;
    this.luv2shopService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        this.creditCardMonths = data;

    });

    this.luv2shopService.getCreditCardYears().subscribe(
      data =>{
        this.creditCardYears = data;

    });
    
    this.luv2shopService.getCountries().subscribe(data=>{

      this.countries =data;
    });


  }
  onSubmit(){
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  copyShippingAddressToBillingAddress(event){

    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }

  }
 
  handleMonthsAndYears(){
   const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
   const currentYear: number = new Date().getFullYear();
   const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

   let startMonth: number;
   if(currentYear === selectedYear){
     startMonth = new Date().getMonth() + 1;
   }
   else{
     startMonth = 1;
   }

   this.luv2shopService.getCreditCardMonths(startMonth).subscribe(data=>{
     this.creditCardMonths =data;
   });

  }

  getStates(formGroupName: string){

    const formgroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formgroup.value.country.code;
const countryName = formgroup.value.country.name;
this.luv2shopService.getStates(countryCode).subscribe(data =>{

if(formGroupName === 'shippingAddress'){
  this.shippingAddressStates = data
}
else{
  this.billingAddressStates =data;
}
formgroup.get('state').setValue(data[0]);

});


  }

}
