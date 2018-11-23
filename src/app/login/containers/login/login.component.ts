import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'login',
  styleUrls: ['login.component.scss'],
  template: `
  <div class="login">
    <h1 class="login__header">Sign In or Sign Up</h1>
    <div class="login__form">
      <!-- <div class="why">
        <button type="button" class="btn btn--link">Why?</button>
      </div> -->
      <button
        type="button"
        class="btn btn--icon btn--google"
        (click)="signInWithGoogle()"
      >Sign In with Google
      </button>
      <br />
      <div class="email-btn-container" [ngClass]="{'open': !formOpen}">
        <button
          type="button"
          class="btn btn--icon btn--email"
          (click)="openForm()"
        >Sign In with Email
        </button>
      </div>
      <form
        name="userform"
        method="post"
        #formCtrl="ngForm"
        [ngClass]="{'open': formOpen}"
      >
        <button
          type="button"
          class="close"
          (click)="closeForm()"
        >X</button>
        <p>Sign In with Email</p>
        <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
        <div class="form-group">
          <input
            type="email"
            class="form-control"
            [(ngModel)]="user.email"
            id="email"
            name="email"
            autocomplete="off"
            required
          >
          <label for="email">Email address</label>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            [(ngModel)]="user.password"
            id="password"
            name="password"
            autocomplete="off"
            required
          >
          <label for="password">Password</label>
        </div>
        <div class="form-group toggle">
          <label for="up-or-in">Sign Up</label>
          <input
            type="checkbox"
            id="up-or-in"
            name="up-or-in"
            class="toggle"
            checked
            (click)="toggleAction()"
          >
          <label for="up-or-in">Sign In</label>
        </div>
        <button
          type="button"
          class="btn btn--submit"
          (click)="signInWithEmail()"
        >
          <span *ngIf="signIn">Sign In</span>
          <span *ngIf="!signIn">Sign Up</span>
        </button>
      </form>
    </div>
    <p class="policies">
      <button
        type="button"
        class="btn btn--link"
        (click)="openPolicy()"
      >Privacy Policy</button> |
      <button
        type="button"
        class="btn btn--link"
        (click)="openTerms()"
      >Terms and Conditions</button>
    </p>
    <div class="login__background"></div>
    <modal
      *ngIf="openModal"
      [bodyText]="bodyText"
      [open]="openModal"
      (close)="handleModalClose()"
    ></modal>
  </div>
  `
})
export class LoginComponent {
  // variables
  formOpen: boolean = false;
  signIn: boolean = true;
  user = {
    email: '',
    password: ''
  };
  errorMessage: string;
  bodyText: string;
  openModal: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  openForm() {
    this.formOpen = true;
  }

  closeForm() {
    this.formOpen = false;
    window.setTimeout((function() {
      this.errorMessage = null;
      this.user = {
        email: '',
        password: ''
      };
    }).bind(this), 350);
  }

  toggleAction() {
    this.signIn = !this.signIn;
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle()
    .then((res) => {
        this.router.navigateByUrl('');
      })
    .catch((err) => this.errorMessage = err);
  }

  signUpWithEmail() {
    this.authService.signUpAndInWithEmail(this.user.email, this.user.password)
    .then((res) => {
      this.router.navigateByUrl('');
    })
    .catch((err) => this.errorMessage = err);
  }

  signInWithEmail() {
    if (this.signIn) {
      this.authService.signInWithEmail(this.user.email, this.user.password)
      .then((res) => {
        this.router.navigateByUrl('');
      })
      .catch((err) => this.errorMessage = err);
    } else {
      this.signUpWithEmail();
    }
  }

  handleModalClose() {
    this.openModal = false;
  }

  openPolicy() {
    this.openModal = true;
    this.bodyText = `
    <h2 class="heading-no-top text-center">Privacy Notice</h2>

    <p>This privacy notice discloses the privacy practices for SEATTLE-BEER.COM. This privacy notice applies solely to information collected by this website. It will notify you of the following:</p>

    <ol>
      <li>What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.</li>
      <li>What choices are available to you regarding the use of your data.</li>
      <li>The security procedures in place to protect the misuse of your information.</li>
      <li>How you can correct any inaccuracies in the information.</li>
    </ol>

    <h3>Information Collection, Use, and Sharing</h3>

    <p>We are the sole owners of the information collected on this site. We only have access to/collect information that you voluntarily give us via email or other direct contact from you. We will not sell or rent this information to anyone.</p>

    <p>We will use your information to respond to you, regarding the reason you contacted us. We will not share your information with any third party outside of our organization, other than as necessary to fulfill your request, e.g. to ship an order.</p>

    <p>Unless you ask us not to, we may contact you via email in the future to tell you about specials, new products or services, or changes to this privacy policy.</p>

    <h3>Your Access to and Control Over Information</h3>

    <p>You may opt out of any future contacts from us at any time. You can do the following at any time by contacting us via the email address or phone number given on our website:</p>

    <ul>
      <li>See what data we have about you, if any.</li>
      <li>Change/correct any data we have about you.</li>
      <li>Have us delete any data we have about you.</li>
      <li>Express any concern you have about our use of your data.</li>
    </ul>

    <h3>Security</h3>

    <p>We take precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline.</p>

    <p>While we use encryption to protect sensitive information transmitted online, we also protect your information offline. Only employees who need the information to perform a specific job (for example, billing or customer service) are granted access to personally identifiable information. The computers/servers in which we store personally identifiable information are kept in a secure environment.</p>

    <h3>Cookies</h3>

    <p>Some of our business partners may use cookies on our site (for example, advertisers). However, we have no access to or control over these cookies.</p>

    <p><strong>If you feel that we are not abiding by this privacy policy, you should contact us immediately via <a href="mailto:contact.seattlebeer@gmail.com">email</a>.</strong></p>
    `;
  }

  openTerms() {
    this.openModal = true;
    this.bodyText = `
    <h2 class="heading-no-top text-center">SEATTLE-BEER.COM Terms and Conditions</h2>

    <h3>1. Introduction.</h3>

    <p>These Website Standard Terms And Conditions (these “Terms” or these “Website Standard Terms And Conditions”) contained herein on this webpage, shall govern your use of this website, including all pages within this website (collectively referred to herein below as this “Website”). These Terms apply in full force and effect to your use of this Website and by using this Website, you expressly accept all terms and conditions contained herein in full. You must not use this Website, if you have any objection to any of these Website Standard Terms And Conditions.</p>

    <p>This Website is not for use by any minors (defined as those who are not at least 18 years of age), and you must not use this Website if you a minor.</p>

    <h3>2. Intellectual Property Rights.</h3>

    <p>Other than content you own, which you may have opted to include on this Website, under these Terms, SEATTLE-BEER.COM and/or its licensors own all rights to the intellectual property and material contained in this Website, and all such rights are reserved.</p>

    <p>You are granted a limited license only, subject to the restrictions provided in these Terms, for purposes of viewing the material contained on this Website.</p>

    <h3>3. Restrictions.</h3>

    <p>You are expressly and emphatically restricted from all of the following:</p>

    <ol>
      <li>publishing any Website material in any media;</li>

      <li>selling, sublicensing and/or otherwise commercializing any Website material;</li>

      <li>publicly performing and/or showing any Website material;</li>

      <li>using this Website in any way that is, or may be, damaging to this Website;</li>

      <li>using this Website in any way that impacts user access to this Website;</li>

      <li>using this Website contrary to applicable laws and regulations, or in a way that causes, or may cause, harm to the Website, or to any person or business entity;</li>

      <li>engaging in any data mining, data harvesting, data extracting or any other similar activity in relation to this Website, or while using this Website;</li>

      <li>using this Website to engage in any advertising or marketing;</li>
    </ol>

    <p>Certain areas of this Website are restricted from access by you and SEATTLE-BEER.COM may further restrict access by you to any areas of this Website, at any time, in its sole and absolute discretion.  Any user ID and password you may have for this Website are confidential and you must maintain confidentiality of such information.</p>

    <h3>4. Your Content.</h3>

    <p>In these Website Standard Terms And Conditions, “Your Content” shall mean any audio, video, text, images or other material you choose to display on this Website. With respect to Your Content, by displaying it, you grant SEATTLE-BEER.COM a non-exclusive, worldwide, irrevocable, royalty-free, sublicensable license to use, reproduce, adapt, publish, translate and distribute it in any and all media.</p>

    <p>Your Content must be your own and must not be infringing on any third party’s rights. SEATTLE-BEER.COM reserves the right to remove any of Your Content from this Website at any time, and for any reason, without notice.</p>

    <h3>5. No warranties.</h3>

    <p>This Website is provided “as is,” with all faults, and SEATTLE-BEER.COM makes no express or implied representations or warranties, of any kind related to this Website or the materials contained on this Website. Additionally, nothing contained on this Website shall be construed as providing consult or advice to you.</p>

    <h3>6. Limitation of liability.</h3>

    <p>In no event shall SEATTLE-BEER.COM, nor any of its officers, directors and employees, be liable to you for anything arising out of or in any way connected with your use of this Website, whether such liability is under contract, tort or otherwise, and SEATTLE-BEER.COM, including its officers, directors and employees shall not be liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.</p>

    <h3>7. Indemnification.</h3>

    <p>You hereby indemnify to the fullest extent SEATTLE-BEER.COM from and against any and all liabilities, costs, demands, causes of action, damages and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any of the provisions of these Terms.</p>

    <h3>8. Severability.</h3>

    <p>If any provision of these Terms is found to be unenforceable or invalid under any applicable law, such unenforceability or invalidity shall not render these Terms unenforceable or invalid as a whole, and such provisions shall be deleted without affecting the remaining provisions herein.</p>

    <h3>9. Variation of Terms.</h3>

    <p>SEATTLE-BEER.COM is permitted to revise these Terms at any time as it sees fit, and by using this Website you are expected to review such Terms on a regular basis to ensure you understand all terms and conditions governing use of this Website.</p>

    <h3>10. Assignment.</h3>

    <p>SEATTLE-BEER.COM shall be permitted to assign, transfer, and subcontract its rights and/or obligations under these Terms without any notification or consent required. However, .you shall not be permitted to assign, transfer, or subcontract any of your rights and/or obligations under these Terms.</p>

    <h3>11. Entire Agreement.</h3>

    <p>These Terms, including any legal notices and disclaimers contained on this Website, constitute the entire agreement between SEATTLE-BEER.COM and you in relation to your use of this Website, and supersede all prior agreements and understandings with respect to the same.</p>

    <h3>12. Governing Law & Jurisdiction.</h3>

    <p>These Terms will be governed by and construed in accordance with the laws of the State of Washington, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Washington for the resolution of any disputes.</p>
    `;
  }
}
