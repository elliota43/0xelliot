#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
  int *p = malloc(sizeof(int));

  if (p == NULL) {
    fprintf(stderr, "malloc failed\n");
    return 1;
  }

  while (1) {
    printf("Process ID: %d | Memory Address: %p\n", getpid(), (void *)p);
    sleep(1);
  }
  return 0;
}
