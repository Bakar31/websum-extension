async function getOrCreateEncryptionKey() {
  const result = await chrome.storage.local.get('encryptionKey');
  
  if (result.encryptionKey) {
    const keyData = Uint8Array.from(atob(result.encryptionKey), c => c.charCodeAt(0));
    return await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const exportedKeyString = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
  
  await chrome.storage.local.set({ encryptionKey: exportedKeyString });
  return key;
}

export async function encryptData(data) {
  try {
    const key = await getOrCreateEncryptionKey();
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encodedData
    );
    
    const result = new Uint8Array(iv.length + encryptedData.byteLength);
    result.set(iv, 0);
    result.set(new Uint8Array(encryptedData), iv.length);
    
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    throw new Error('Failed to encrypt data');
  }
}

export async function decryptData(encryptedData) {
  try {
    const key = await getOrCreateEncryptionKey();
    
    const encryptedArray = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    const iv = encryptedArray.slice(0, 12);
    const data = encryptedArray.slice(12);
    
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decryptedData);
  } catch (error) {
    throw new Error('Failed to decrypt data. The API key might be corrupted.');
  }
}
