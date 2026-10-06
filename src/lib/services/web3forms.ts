type Web3FormsResponse = {
  success?: boolean;
};

export async function submitContactForm(formData: FormData, accessKey: string) {
  formData.set("access_key", accessKey);

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData,
  });
  const data = (await response.json()) as Web3FormsResponse;

  if (!response.ok || !data.success) {
    throw new Error("Form submission failed");
  }
}
