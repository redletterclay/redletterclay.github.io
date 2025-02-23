---
layout: page
title: Contact
description: |
 A Chicago based ceramic studio featuring pottery by Davey Ball. Thoughtfully made ceramics for every day enjoyment.
hero: no
nav: sticky
---
<div class="row animate__animated animate__fadeIn">
    <div class="col-md-6 col-sm-12">
        <div class="bg-red p-4 pt-5 rounded-3 me-3">
        <h1 class="ital mb-4">Have a question?</h1>
        <p>Use this form to get in touch.</p>
        </div>
        <div class="p-4">
        <h3 class="pt-3">Order Inquiries</h3>
        <p>Sorry, I'm unable to correspond about orders via Instagram DM. If this is a regarding an an order, please include your order number and I will get back with you as soon as possible.</p>
        </div>
        <img src="/assets/img/circle-smile-mug.png" class="img-fluid p-5 text-center" alt="Happy Customers">
    </div>
    <div class="col-md-6 col-sm-12">
        <form id="fs-frm" name="simple-contact-form" accept-charset="utf-8" action="https://formspree.io/f/mdknnnwd" method="post">
            <fieldset id="fs-frm-inputs">
                <h3 class="text-black"><label for="full-name"><i class="fa-regular fa-address-card fc-7 opacity-75"></i> Name</label></h3>
                <input type="text" name="name" id="full-name" required="yes" class="w-100 ls-1 p-2 mb-4 form-input rounded-3">
                <h3 class="text-black"><label for="email-address"><i class="fa-solid fa-at fc-7 opacity-75"></i> Email Address</label></h3>
                <input type="email" name="_replyto" id="email-address" required="yes" class="w-100 p-2 mb-4 form-input rounded-3">
                <h3 class="text-black"><label for="order-number"><i class="fa-solid fa-receipt fc-7 opacity-75"></i> Order #</label></h3>
                <input type="text" name="order-number" id="order-number" placeholder="if applicable" class="w-100 p-2 mb-4 rounded-3 form-input">
                <h3 class="text-black"><label for="message"><i class="fa-solid fa-wine-bottle fc-7 opacity-75"></i> Message</label></h3>
                <textarea rows="5" name="message" id="message" class="w-100 rounded-3 fc-1 p-2 form-textarea" required="yes"></textarea>
                <input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission">
            </fieldset>
            <button type="submit" value="Submit" class="btn btn-primary submit py-2 pb-1 px-5 my-5 w-100 rounded-pill"><i class="fa-solid fa-paper-plane"></i> SEND</button>
        </form>
    </div>
</div>