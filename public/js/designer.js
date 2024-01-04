document.addEventListener("DOMContentLoaded", function () {
  // Fetch designers data from the API
  getData(`/api${window.location.pathname}`, {}, "GET")
    .then((data) => {
      // Call a function to render designers on the page
      renderDesigners(data);
    })
    .catch((error) => {
      console.error("Error fetching designers:", error);
    });
  // Function to render designers on the page
  function renderDesigners(designer) {
    const designersContainer = document.getElementById("designer-container");
    const designerGalleryContainer = document.getElementById(
      "designer-gallery-container"
    );

    const designerDiv = document.createElement("div");
    designerDiv.classList.add(
      "designer-post",
      "d-flex",
      "flex-row",
      "designer-img"
    );
    const aElement = document.createElement("a");
    aElement.classList.add("designer-post", "d-flex", "flex-row");
    aElement.href = `/designer/${designer.name}`;

    const thumbDiv = document.createElement("div");
    thumbDiv.classList.add("thumb");

    const designerImage = document.createElement("img");
    designerImage.classList.add("img-fluid");
    if (designer.logo && designer.logo.imageData && designer.logo.contentType) {
      designerImage.src = `data:${designer.logo.contentType};base64,${designer.logo.imageData}`;
    } else {
      designerImage.src = "img/post.png";
    }
    designerImage.alt = designer.name;

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details");

    // Add other designer details here based on your API response
    const designerName = document.createElement("h4");
    designerName.innerHTML = designer.name;

    const designerDescription = document.createElement("h6");
    designerDescription.innerHTML = designer.description;

    const designerAvgRating = document.createElement("div");
    designerAvgRating.classList.add("row", "justify-content-start", "rating");
    const icon = document.createElement("i");
    icon.classList.add("fa", "fa-star", "checked");
    icon.style.color = "#ffe234";
    icon.style.fontSize = "20px";
    icon.style.margin = "0";
    const rating = document.createElement("p");
    rating.style.margin = "0 0 0 10px";
    rating.style.color = "#000";
    rating.innerHTML = designer.averageRating;

    // Append elements to the designerDiv
    designerDiv.appendChild(aElement);
    aElement.appendChild(thumbDiv);
    thumbDiv.appendChild(designerImage);
    aElement.appendChild(detailsDiv);
    detailsDiv.appendChild(designerName);
    detailsDiv.appendChild(designerDescription);

    if (designer.links) {
      const designerLinks = document.createElement("div");
      designerLinks.classList.add("row", "justify-content-start");
      designerLinks.style.margin = "0 0 10px 0";
      designer.links.forEach((website) => {
        const designerLink = document.createElement("a");
        const icon = document.createElement("i");
        if (website.type === "Facebook") {
          icon.classList.add("fa", "fa-facebook");
          icon.style.color = "#3b5998";
        }
        if (website.type === "Twitter") {
          icon.classList.add("fa", "fa-twitter");
          icon.style.color = "#1da1f2";
        }
        if (website.type === "Instagram") {
          icon.classList.add("fa", "fa-instagram");
          icon.style.color = "#e1306c";
        }
        if (website.type === "Linkedin") {
          icon.classList.add("fa", "fa-linkedin");
          icon.style.color = "#0077b5";
        }
        if (website.type === "Website") {
          icon.classList.add("fa", "fa-globe");
          icon.style.color = "#000000";
        }
        icon.style.fontSize = "30px";
        icon.style.margin = "0 10px 0 0";
        designerLink.appendChild(icon);
        designerLink.href = website.url;
        designerLink.target = "_blank";
        designerLink.rel = "noopener noreferrer";
        designerLinks.appendChild(designerLink);
      });
      detailsDiv.appendChild(designerLinks);
    }
    detailsDiv.appendChild(designerAvgRating);
    designerAvgRating.appendChild(icon);
    designerAvgRating.appendChild(rating);
    designersContainer.appendChild(designerDiv);
    const designerGallery = document.createElement("div");
    designerGallery.classList.add("row", "gallery-item");
    designer.photos.forEach((photo) => {
      const designerPhotoDiv = document.createElement("div");
      designerPhotoDiv.classList.add("col-md-4");
      const designerPhoto = document.createElement("div");
      designerPhoto.classList.add("designer-gallery-image");
      designerPhoto.style.background = `url(data:${photo.contentType};base64,${photo.imageData})`;
      designerPhotoDiv.appendChild(designerPhoto);
      designerGallery.appendChild(designerPhotoDiv);
    });

    designerGalleryContainer.appendChild(designerGallery);

    const designerOptionsContainer = document.getElementById(
      "designer-options-container"
    );
    const designerOptionDiv = document.createElement("div");
    designerOptionDiv.classList.add("designer-post", "d-flex", "flex-column");
    designer.options.forEach((option) => {
      const designerOption = document.createElement("div");
      const designerOptionName = document.createElement("h4");
      designerOptionName.classList.add("d-flex", "flex-row", "align-items-top");
      designerOptionName.innerHTML = option.label;
      const designerOptionRequired = document.createElement("i");
      designerOptionRequired.classList.add("fa", "fa-asterisk");
      designerOptionRequired.style.color = "#ff0000";
      designerOptionRequired.style.fontSize = "8px";
      designerOptionRequired.style.margin = "0 0 0 5px";
      const designerOptionPrice = document.createElement("p");
      designerOptionPrice.innerHTML = `+${option.price}$`;
      designerOptionDiv.appendChild(designerOption);

      designerOptionName.appendChild(designerOptionRequired);
      designerOption.appendChild(designerOptionName);

      if (option.type === "text field" || option.type === "text area") {
        const type = option.type === "text field" ? "input" : "textarea";
        const designerOptionInput = document.createElement(type);
        designerOptionInput.type = option.dataType;
        designerOptionInput.placeholder = option.placeholder;
        designerOptionInput.required = option.required;
        designerOption.appendChild(designerOptionInput);
      } else if (option.type === "checkbox" || option.type === "radio button") {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.classList.add("designer-element-widget", "mt-30");
        let i = 0;
        option.optionList.forEach((optionListData) => {
          i++;
          const checkboxDiv = document.createElement("div");
          checkboxDiv.classList.add(
            "switch-wrap",
            "d-flex",
            "justify-content-between",
            "align-items-center"
          );
          if (option.type === "checkbox") {
            const optionCheckbox = document.createElement("div");
            ptionCheckbox.classList.add(`primary-checkbox`);
            const designerOptionCheckbox = document.createElement("input");
            designerOptionCheckbox.type = "checkbox";
            designerOptionCheckbox.required = option.required;
            designerOptionCheckbox.value = optionListData.text;
            designerOptionCheckbox.id = `${optionListData.text + i}`;
            const designerOptionCheckboxLabel = document.createElement("label");
            designerOptionCheckboxLabel.htmlFor = `${optionListData.text + i}`;
            const designerOptionCheckboxText = document.createElement("p");
            designerOptionCheckboxText.innerHTML =
              optionListData.text + "     +" + optionListData.price + "$";
            checkboxDiv.appendChild(designerOptionCheckboxText);
            checkboxDiv.appendChild(optionCheckbox);
            optionCheckbox.appendChild(designerOptionCheckbox);
            optionCheckbox.appendChild(designerOptionCheckboxLabel);
            checkboxContainer.appendChild(checkboxDiv);
          } else {
            const designerOptionCheckbox = document.createElement("input");
            designerOptionCheckbox.type = "radio";
            designerOptionCheckbox.required = option.required;
            designerOptionCheckbox.value = optionListData.text;
            designerOptionCheckbox.id = `${optionListData.text + i}`;
            designerOptionCheckbox.name = `${option.label}`;
            const designerOptionCheckboxLabel = document.createElement("label");
            designerOptionCheckboxLabel.htmlFor = `${optionListData.text + i}`;
            const designerOptionCheckboxText = document.createElement("p");
            designerOptionCheckboxText.innerHTML =
              optionListData.text + "     +" + optionListData.price + "$";
            checkboxDiv.appendChild(designerOptionCheckboxText);
            checkboxDiv.appendChild(designerOptionCheckbox);
            checkboxDiv.appendChild(designerOptionCheckboxLabel);
            checkboxContainer.appendChild(checkboxDiv);
          }
        });
        designerOption.appendChild(checkboxContainer);
        if (option.other) {
          const designerOptionCheckboxDiv = document.createElement("div");
          designerOptionCheckboxDiv.classList.add("mt-10");
          const designerOptionCheckbox = document.createElement("input");
          designerOptionCheckbox.type = "text";
          designerOptionCheckbox.name = "otherText";
          designerOptionCheckbox.placeholder = "Other";
          designerOptionCheckbox.onfocus = "this.placeholder = ''";
          designerOptionCheckbox.onblur = "this.placeholder = 'Other'";
          designerOptionCheckbox.classList.add("designer-input");
          designerOptionCheckbox.required = option.required;
          designerOptionCheckboxDiv.style.backgroundColor = "#fff";

          designerOptionCheckboxDiv.appendChild(designerOptionCheckbox);
          designerOption.appendChild(designerOptionCheckboxDiv);
        }
      } else if (option.type === "dropdown") {
        const designerOptionDiv = document.createElement("div");
        designerOptionDiv.classList.add("default-select");
        designerOptionDiv.id = "default-select";
        const designerOptionSelect = document.createElement("select");
        designerOptionSelect.required = option.required;
        option.optionList.unshift({ text: "Select an option", price: 0 });
        option.optionList.forEach((option) => {
          const designerOptionSelectOption = document.createElement("option");
          designerOptionSelectOption.value = option.text;
          designerOptionSelectOption.innerHTML =
            option.price === 0
              ? option.text
              : option.text + "     +" + option.price + "$";
          designerOptionSelect.appendChild(designerOptionSelectOption);
        });
        designerOptionDiv.appendChild(designerOptionSelect);
        designerOption.appendChild(designerOptionDiv);
      } else if (option.type === "date and time") {
        const designerOptionInput = document.createElement("input");
        designerOptionInput.type = option.type;
        designerOptionInput.required = option.required;
        designerOptionInput.placeholder = option.placeholder;
        designerOptionInput.min = option.min;
        designerOptionInput.max = option.max;

        designerOption.appendChild(designerOptionInput);
      } else if (option.type === "date" || option.type === "time") {
        const designerOptionInput = document.createElement("input");
        designerOptionInput.type = option.type;
        designerOptionInput.required = option.required;
        designerOptionInput.placeholder = option.placeholder;
        designerOptionInput.min = option.min;
        designerOptionInput.max = option.max;
        designerOption.appendChild(designerOptionInput);
      }
      if (option.price !== 0 && option.price) {
        designerOption.appendChild(designerOptionPrice);
      }
      designerOptionsContainer.appendChild(designerOptionDiv);
    });
    const orderButton = document.createElement("a");
    orderButton.classList.add(
      "genric-btn",
      "primary",
      "mt-30",
      "align-self-end"
    );
    orderButton.innerHTML = "Order";
    orderButton.href = `/order/${designer.name}`;
    designerOptionDiv.appendChild(orderButton);
    getData(`/api/rating/${designer._id}`, {}, "GET")
      .then((data) => {
        renderRatings(data);
      })
      .catch((error) => {
        console.error("Error fetching designers:", error);
      });

    function renderRatings(data) {
      const ratingsContainer = document.getElementById(
        "designer-rating-container"
      );
      ratingsContainer.classList.add(
        "singular-popular-post",
        "d-flex",
        "flex-column"
      );
      const ratingsTitle = document.createElement("h4");
      ratingsTitle.innerHTML = "Ratings";
      ratingsContainer.appendChild(ratingsTitle);
      data.ratings.forEach((rating) => {
        const ratingsDiv = document.createElement("div");
        ratingsDiv.classList.add(
          "single-popular-post",
          "d-flex",
          "flex-column",
          "mt-20"
        );
        const ratingUser = document.createElement("div");
        ratingUser.classList.add(
          "d-flex",
          "flex-row",
          "align-items-center",
          "justify-content-start",
          "user-details"
        );
        const ratingAndTitle = document.createElement("div");
        ratingAndTitle.classList.add(
          "d-flex",
          "flex-column",
          "align-items-start"
        );
        const ratingUserName = document.createElement("h6");
        ratingUserName.innerHTML = rating.user.username;
        ratingUserName.style.margin = "0 0 10px 0";
        const userImage = document.createElement("i");
        userImage.classList.add("fa", "fa-user-circle");
        userImage.style.fontSize = "30px";
        userImage.style.margin = "0 10px 0 0";
        ratingUser.appendChild(userImage);
        ratingAndTitle.appendChild(ratingUserName);

        if (rating.rating === 0.5) {
          ratingAndTitle.append(ratingStarsIcons(0, 1, 4));
        } else if (rating.rating === 1) {
          ratingAndTitle.append(ratingStarsIcons(1, 0, 4));
        } else if (rating.rating === 1.5) {
          ratingAndTitle.append(ratingStarsIcons(1, 1, 3));
        } else if (rating.rating === 2) {
          ratingAndTitle.append(ratingStarsIcons(2, 0, 3));
        } else if (rating.rating === 2.5) {
          ratingAndTitle.append(ratingStarsIcons(2, 1, 2));
        } else if (rating.rating === 3) {
          ratingAndTitle.append(ratingStarsIcons(3, 0, 2));
        } else if (rating.rating === 3.5) {
          ratingAndTitle.append(ratingStarsIcons(3, 1, 1));
        } else if (rating.rating === 4) {
          ratingAndTitle.append(ratingStarsIcons(4, 0, 1));
        } else if (rating.rating === 4.5) {
          ratingAndTitle.append(ratingStarsIcons(4, 1, 0));
        } else if (rating.rating === 5) {
          ratingAndTitle.append(ratingStarsIcons(5, 0, 0));
        }
        ratingUser.appendChild(ratingAndTitle);
        const replyAndTitle = document.createElement("div");
        replyAndTitle.classList.add(
          "d-flex",
          "flex-column",
          "align-items-center",
          "justify-content-around",
          "mr-20"
        );
        const ratingReview = document.createElement("p");
        ratingReview.innerHTML = rating.review;
        ratingReview.style.margin = "10px";
        const ratingReply = document.createElement("div");
        const replyDiv = document.createElement("div");
        replyDiv.classList.add("d-flex", "flex-column");
        const designerLogo = document.createElement("img");
        designerLogo.classList.add("img-fluid");
        if (
          designer.logo &&
          designer.logo.imageData &&
          designer.logo.contentType
        ) {
          designerLogo.src = `data:${designer.logo.contentType};base64,${designer.logo.imageData}`;
        } else {
          designerLogo.src = "img/post.png";
        }
        designerLogo.alt = designer.name;
        designerLogo.style.width = "50px";
        designerLogo.style.height = "50px";
        designerLogo.style.borderRadius = "50%";
        designerLogo.style.margin = "0 0 10px 0";
        replyAndTitle.appendChild(designerLogo);
        const replyDesigner = document.createElement("h6");
        replyDesigner.innerHTML = designer.name;
        const replyText = document.createElement("p");
        replyText.innerHTML = rating.reply.text;
        replyAndTitle.appendChild(replyDesigner);
        replyDiv.appendChild(replyAndTitle);
        replyDiv.appendChild(replyText);
        ratingReply.appendChild(replyDiv);
        ratingsDiv.appendChild(ratingUser);
        ratingsDiv.appendChild(ratingReview);
        ratingsDiv.appendChild(ratingReply);
        // ratingsDiv.appendChild(ratingDiv);
        // ratingsDiv.appendChild(ratingTumb);
        ratingsContainer.appendChild(ratingsDiv);
      });
    }
  }

  function ratingStarsIcons(filled, half, empty) {
    const ratingStars = document.createElement("div");
    ratingStars.classList.add("rating", "d-flex", "flex-row");

    for (let i = 0; i < filled; i++) {
      const ratingStarIcon = document.createElement("i");
      ratingStarIcon.classList.add("fa", "fa-star", "checked");
      ratingStarIcon.style.color = "#ffe234";
      ratingStarIcon.style.fontSize = "16px";
      ratingStarIcon.style.margin = "0 0 0 2px";
      ratingStars.appendChild(ratingStarIcon);
    }

    for (let i = 0; i < half; i++) {
      const ratingHalfStarIcon = document.createElement("i");
      ratingHalfStarIcon.classList.add("far", "fa-star-half-stroke");
      ratingHalfStarIcon.style.color = "#ffe234";
      ratingHalfStarIcon.style.fontSize = "15px";
      ratingHalfStarIcon.style.margin = "0 0 0 2px";
      ratingStars.appendChild(ratingHalfStarIcon);
    }

    for (let i = 0; i < empty; i++) {
      const ratingEmptyStarIcon = document.createElement("i");
      ratingEmptyStarIcon.classList.add("far", "fa-star", "fa-regular");
      ratingEmptyStarIcon.style.color = "#ffe234";
      ratingEmptyStarIcon.style.fontSize = "15px";
      ratingEmptyStarIcon.style.margin = "0 0 0 2px";
      ratingStars.appendChild(ratingEmptyStarIcon);
    }

    console.log(ratingStars);
    return ratingStars;
  }
});
