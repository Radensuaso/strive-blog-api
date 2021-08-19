import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

export const sendEmail = async (blogPost, pdf) => {
  const msg = {
    to: "andrels9283@gmail.com", // in a real scenario this can be blogPost.author.email
    from: "andrels9283@gmail.com",
    subject: "The blog Post you created",
    //text: "and easy to do anywhere, even with Node.js",
    html: `<p>Hello <strong>${blogPost.author.name}!</strong></p><p>Here is your <strong>Blog Post!</strong></p><p>Please see it attached</p><p>Best Regards. <br/> Strive School.</p>`,
    attachments: [
      {
        content: pdf,
        filename: "Blog post.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  await sgMail.send(msg);
};
