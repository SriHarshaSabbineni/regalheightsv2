function escapeHtml(unsafe) {
  if (unsafe == null) return 'N/A';
  return unsafe.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestPost(context) {
  try {
    let input;
    try {
      input = await context.request.json();
      if (!input || typeof input !== 'object') {
        throw new Error('Payload must be a JSON object');
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "Bad Request: Invalid JSON payload." }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Use RESEND API to send email
    const resendApiKey = context.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
        return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY environment variable. Add it in Cloudflare Pages dashboard." }), { status: 500 });
    }

    let htmlBody = `<h3>New Enquiry from Regal Heights Website</h3>`;
    htmlBody += `<p><strong>Name:</strong> ${escapeHtml(input.name)}</p>`;
    htmlBody += `<p><strong>Email:</strong> ${escapeHtml(input.email)}</p>`;
    htmlBody += `<p><strong>Interest:</strong> ${escapeHtml(input.interest)}</p>`;
    
    if (input.interest === 'London Stay Enquiry') {
        if (input.checkin) htmlBody += `<p><strong>Dates:</strong> ${escapeHtml(input.checkin)} to ${escapeHtml(input.checkout)}</p>`;
        if (input.guests) htmlBody += `<p><strong>Guests:</strong> ${escapeHtml(input.guests)}</p>`;
    } else {
        if (input.budget) htmlBody += `<p><strong>Budget:</strong> ${escapeHtml(input.budget)}</p>`;
    }
    
    const sanitizedMessage = escapeHtml(input.message).replace(/&#039;/g, "'").replace(/\n/g, '<br/>');
    htmlBody += `<p><strong>Message:</strong><br/>${sanitizedMessage}</p>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Regal Heights Website <onboarding@resend.dev>', // Needs to be verified domain for production
        to: [context.env.DESTINATION_EMAIL || 'sriharsha.sabbineni@gmail.com'],
        subject: `New Enquiry: ${escapeHtml(input.interest)}`,
        html: htmlBody,
        ...(input.email && input.email.includes('@') ? { reply_to: input.email } : {})
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
