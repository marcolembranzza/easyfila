export const playNotificationSound = async () => {
  try {
    console.log('Iniciando reprodução do som...');
    const audio = new Audio('/notification.mp3');
    audio.volume = 1.0;
    
    // Pré-carrega o áudio
    await audio.load();
    console.log('Áudio carregado, tentando reproduzir...');
    
    // Tenta reproduzir e aguarda a conclusão
    const playPromise = await audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Som reproduzido com sucesso!');
        })
        .catch((error) => {
          console.error('Erro ao reproduzir som:', error);
        });
    }
  } catch (error) {
    console.error('Erro ao inicializar áudio:', error);
  }
};