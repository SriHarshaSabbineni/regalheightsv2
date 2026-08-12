const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/index.html');
let html = fs.readFileSync(file, 'utf8');

const newForm = \					<form id="contactForm">
						<div class="form-group">
							<label class="form-label">Full Name</label>
							<input type="text" name="name" class="form-input" required>
						</div>
						<div class="form-group">
							<label class="form-label">Email Address</label>
							<input type="email" name="email" class="form-input" required>
						</div>
						
						<div class="form-group">
							<label class="form-label">Interest</label>
							<select name="interest" class="form-input" required>
								<option value="" disabled selected>Select an area of interest...</option>
								<option value="London Stay Enquiry">London Short Stays</option>
								<option value="Global Properties Sales Introductions">Global Properties</option>
								<option value="Dubai (Palm Jebel Ali)">Dubai (Palm Jebel Ali)</option>
							</select>
						</div>
						
						<!-- Conditional: London Stays -->
						<div id="conditional-london" style="display: none;">
							<div class="form-group" style="display: flex; gap: 16px;">
								<div style="flex: 1;">
									<label class="form-label">Check-in Date</label>
									<input type="date" name="checkin" class="form-input">
								</div>
								<div style="flex: 1;">
									<label class="form-label">Check-out Date</label>
									<input type="date" name="checkout" class="form-input">
								</div>
							</div>
							<div class="form-group">
								<label class="form-label">Number of Guests</label>
								<input type="number" name="guests" class="form-input" min="1" max="10">
							</div>
						</div>
						
						<!-- Conditional: Property Sales -->
						<div id="conditional-sales" style="display: none;">
							<div class="form-group">
								<label class="form-label">Estimated Budget</label>
								<select name="budget" class="form-input">
									<option value="" disabled selected>Select a budget range...</option>
									<option value="Under £1M">Under £1M</option>
									<option value="£1M - £3M">£1M - £3M</option>
									<option value="£3M - £10M">£3M - £10M</option>
									<option value="£10M+">£10M+</option>
								</select>
							</div>
						</div>

						<div class="form-group">
							<label class="form-label">Message</label>
							<textarea name="message" class="form-input" style="resize: vertical; min-height: 120px;" required></textarea>
						</div>
						
						<div style="display: flex; gap: 16px; margin-top: 24px;">
							<button type="button" class="btn-submit" id="btnEmail" style="flex: 1; display: flex; justify-content: center; align-items: center; gap: 8px;">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
								Email Enquiry
							</button>
							<button type="button" class="btn-submit" id="btnWhatsapp" style="flex: 1; background: #25D366; border-color: #25D366; color: white; display: flex; justify-content: center; align-items: center; gap: 8px; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">
								<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
								WhatsApp
							</button>
						</div>
						<div id="formStatus" style="margin-top: 16px; text-align: center; font-size: 14px;"></div>
					</form>

					<script>
					document.addEventListener('DOMContentLoaded', function() {
						const form = document.getElementById('contactForm');
						const interestSelect = form.querySelector('select[name="interest"]');
						const conditionalLondon = document.getElementById('conditional-london');
						const conditionalSales = document.getElementById('conditional-sales');
						const btnEmail = document.getElementById('btnEmail');
						const btnWhatsapp = document.getElementById('btnWhatsapp');
						const statusDiv = document.getElementById('formStatus');
						
						interestSelect.addEventListener('change', function() {
							const val = this.value;
							if (val === 'London Stay Enquiry') {
								conditionalLondon.style.display = 'block';
								conditionalSales.style.display = 'none';
							} else if (val.includes('Global') || val.includes('Dubai')) {
								conditionalLondon.style.display = 'none';
								conditionalSales.style.display = 'block';
							} else {
								conditionalLondon.style.display = 'none';
								conditionalSales.style.display = 'none';
							}
						});

						btnEmail.addEventListener('click', async function() {
							if (!form.reportValidity()) return;
							
							const formData = new FormData(form);
							const data = Object.fromEntries(formData.entries());
							
							btnEmail.disabled = true;
							btnEmail.innerHTML = 'Sending...';
							statusDiv.style.color = 'var(--text-gray)';
							statusDiv.innerText = '';
							
							try {
								const res = await fetch('/api/contact', {
									method: 'POST',
									headers: { 'Content-Type': 'application/json' },
									body: JSON.stringify(data)
								});
								
								if (res.ok) {
									statusDiv.style.color = 'green';
									statusDiv.innerText = 'Thank you! Your enquiry has been sent securely.';
									form.reset();
									conditionalLondon.style.display = 'none';
									conditionalSales.style.display = 'none';
								} else {
									throw new Error('Server error');
								}
							} catch (e) {
								statusDiv.style.color = 'red';
								statusDiv.innerText = 'Unable to send email right now. Please try WhatsApp or email us directly.';
							} finally {
								btnEmail.disabled = false;
								btnEmail.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email Enquiry';
							}
						});

						btnWhatsapp.addEventListener('click', function() {
							if (!form.reportValidity()) return;
							
							const formData = new FormData(form);
							let msg = \*New Enquiry from Regal Heights*\\n\\n\;
							msg += \*Name:* \\\n\;
							msg += \*Email:* \\\n\;
							msg += \*Interest:* \\\n\;
							
							if (formData.get('interest') === 'London Stay Enquiry') {
								if(formData.get('checkin')) msg += \*Dates:* \ to \\\n\;
								if(formData.get('guests')) msg += \*Guests:* \\\n\;
							} else {
								if(formData.get('budget')) msg += \*Budget:* \\\n\;
							}
							
							msg += \\\n*Message:* \\;
							
							const encodedMsg = encodeURIComponent(msg);
							window.open(\https://wa.me/447879991235?text=\\, '_blank');
						});
					});
					</script>\;

const regex = /<form action="https:\/\/formsubmit\.co.*?<\/form>/s;
if (regex.test(html)) {
    html = html.replace(regex, newForm);
    fs.writeFileSync(file, html);
    console.log('Successfully replaced form.');
} else {
    console.log('Could not find form!');
}
