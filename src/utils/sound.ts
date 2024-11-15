export const playNotificationSound = async () => {
  try {
    console.log('Iniciando reprodução do som...');
    const audio = new Audio('/notification.mp3');
    audio.volume = 1.0;
    
    // Aguarda o carregamento do áudio
    await new Promise((resolve) => {
      audio.addEventListener('canplaythrough', resolve, { once: true });
      audio.load();
    });
    
    console.log('Áudio carregado, tentando reproduzir...');
    
    // Tenta reproduzir o áudio após interação do usuário
    await audio.play();
    console.log('Som reproduzido com sucesso!');
  } catch (error) {
    console.error('Erro ao reproduzir som:', error);
    throw new Error('Não foi possível reproduzir o som de notificação');
  }
};