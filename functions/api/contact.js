export async function onRequestPost(context) {
  try {
    const input = await context.request.json();

    // Use RESEND API to send email
    const resendApiKey = context.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
        return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY environment variable. Add it in Cloudflare Pages dashboard." }), { status: 500 });
    }

    let htmlBody = `<h3>New Enquiry from Regal Heights Website</h3>`;
    htmlBody += `<p><strong>Name:</strong> ${input.name || 'N/A'}</p>`;
    htmlBody += `<p><strong>Email:</strong> ${input.email || 'N/A'}</p>`;
    htmlBody += `<p><strong>Interest:</strong> ${input.interest || 'N/A'}</p>`;
    
    if (input.interest === 'London Stay Enquiry') {
        if (input.checkin) htmlBody += `<p><strong>Dates:</strong> ${input.checkin} to ${input.checkout}</p>`;
        if (input.guests) htmlBody += `<p><strong>Guests:</strong> ${input.guests}</p>`;
    } else {
        if (input.budget) htmlBody += `<p><strong>Budget:</strong> ${input.budget}</p>`;
    }
    
    htmlBody += `<p><strong>Message:</strong><br/>${(input.message || '').replace(/\n/g, '<br/>')}</p>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Regal Heights Website <onboarding@resend.dev>', // Needs to be verified domain for production
        to: ['info@regalheights.co.uk'],
        subject: `New Enquiry: ${input.interest || 'Website Form'}`,
        html: htmlBody,
        reply_to: input.email
      })
    });

    const data = await res.json();
    
    if (res.ok) {
        return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 });
    } else {
        return new Response(JSON.stringify(data), { status: 500 });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
